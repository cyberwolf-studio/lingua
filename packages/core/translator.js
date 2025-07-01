// Users will need to configure their bundler to resolve 'lingua-manifest'
// to the actual path of lingua-manifest.js (e.g., resources/js/lingua-manifest.js)
import { LinguaManifest } from 'lingua-manifest';

let loadedTranslations = {};
let activeFetchPromises = {};
let currentGlobalLocale = null; // Can be set by a global configuration

/**
 * Sets the global locale for translations.
 * @param {string} locale - The locale string (e.g., 'en', 'fr').
 */
export const setLocale = (locale) => {
    currentGlobalLocale = locale.toLowerCase();
};

/**
 * Gets the current global locale.
 * Falls back to browser language or a default if not set.
 * @returns {string}
 */
export const getLocale = () => {
    if (currentGlobalLocale) {
        return currentGlobalLocale;
    }
    // Fallback logic (optional, can be simpler e.g. just 'en')
    const browserLang = typeof navigator !== 'undefined' ? navigator.language || navigator.userLanguage : 'en';
    return browserLang.split('-')[0].toLowerCase();
};


/**
 * Loads translation data for a specific locale if not already loaded.
 * @param {string} locale - The locale to load.
 * @returns {Promise<void>}
 */
const loadLocaleData = async (locale) => {
    if (loadedTranslations[locale]) {
        return Promise.resolve();
    }

    if (activeFetchPromises[locale]) {
        return activeFetchPromises[locale];
    }

    if (!LinguaManifest.availableLocales.includes(locale)) {
        console.warn(`Lingua: Locale '${locale}' is not available. Available: ${LinguaManifest.availableLocales.join(', ')}`);
        // Store empty data to prevent re-fetching a non-available locale
        loadedTranslations[locale] = { php: {}, json: {} };
        return Promise.resolve();
    }

    const fetchPromise = fetch(`${LinguaManifest.translationsBasePath}${locale}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Lingua: Failed to load translations for locale '${locale}'. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            loadedTranslations[locale] = data;
        })
        .catch(error => {
            console.error(error);
            // Store empty data on error to prevent re-fetching constantly on failure
            loadedTranslations[locale] = { php: {}, json: {} };
        })
        .finally(() => {
            delete activeFetchPromises[locale];
        });

    activeFetchPromises[locale] = fetchPromise;
    return fetchPromise;
};

/**
 * Main translation function. Asynchronously retrieves and translates a key.
 * @param {string} key - The translation key (e.g., 'messages.welcome').
 * @param {object} [replace] - An object of placeholder/value pairs.
 * @param {boolean|number} [pluralizeValue] - If number, used for pluralization. If boolean, controls pluralization based on 'count' in replace.
 * @param {object} [config] - Optional config. Currently only `locale` is used.
 * @returns {Promise<string>} A promise that resolves to the translated string.
 */
export const trans = async (key, replace = {}, pluralizeValue, config = {}) => {
    const targetLocale = config.locale ? config.locale.toLowerCase() : getLocale();

    await loadLocaleData(targetLocale);

    const localeData = loadedTranslations[targetLocale] || { php: {}, json: {} };
    let translation = null;

    // Try PHP translations first
    try {
        translation =
            localeData.php?.[key] ??
            key.split('.')
            .reduce((t, i) => t && typeof t === 'object' ? t[i] : null, localeData.php);

        if (translation !== null && typeof translation !== 'undefined') {
            return applyReplacementsAndPluralization(translation, replace, pluralizeValue);
        }
    } catch (e) { /* Silently ignore if path does not exist */ }

    // Try JSON translations if PHP not found
    try {
        translation =
            localeData.json?.[key] ??
            key.split('.')
            .reduce((t, i) => t && typeof t === 'object' ? t[i] : null, localeData.json);

        if (translation !== null && typeof translation !== 'undefined') {
            return applyReplacementsAndPluralization(translation, replace, pluralizeValue);
        }
    } catch (e) { /* Silently ignore */ }

    // If key not found in either, return the key itself after attempting replacements (e.g. for :placeholders in key)
    return applyReplacementsAndPluralization(key, replace, false); // Do not pluralize the key itself
};

const applyReplacementsAndPluralization = (translation, replace, pluralizeValue) => {
    let translated = translation;

    // Determine if and how to pluralize
    // If pluralizeValue is a number, it's the count.
    // If pluralizeValue is true, use replace.count.
    // If pluralizeValue is false or undefined, no pluralization.
    let shouldPluralize = false;
    let countForPluralization;

    if (typeof pluralizeValue === 'number') {
        shouldPluralize = true;
        countForPluralization = pluralizeValue;
    } else if (pluralizeValue === true && replace && typeof replace.count === 'number') {
        shouldPluralize = true;
        countForPluralization = replace.count;
    }

    if (shouldPluralize) {
        translated = pluralizeInternal(translated, countForPluralization);
    }

    if (replace && typeof replace === 'object') {
        Object.keys(replace).forEach(placeholderKey => {
            const value = replace[placeholderKey];
            // Ensure global replacement and handle special characters in placeholderKey if necessary
            translated = translated.toString().replace(new RegExp(':' + placeholderKey, 'g'), value);
        });
    }

    return translated.toString();
};

const stripConditions = (sentence) => {
    //This regex was problematic: /^[\{\[]([^\[\]\{\}]*)[\}\]]/
    //It would strip {count} from "{count} item" returning " item"
    //Let's try a more specific one for {n} or [n,m] style conditions if they are at the start ONLY for pluralization choices
    const ret = sentence.replace(/^(?:\{(?:\d+|\d+\.\d+)\}|\[(?:\d+|\*),(?:\d+|\*)\])\s*/, '');
    return ret
}

const pluralize = (sentence, count) => {
    let parts = sentence.split('|')

    //Get SOLO number pattern parts
    const soloPattern = /{(?<count>\d+\.?\d*)}[^\|]*/g
    const soloParts = parts.map(part => {
        let matched = [...part.matchAll(soloPattern)]
        if (matched.length <= 0) {
            return;
        }
        matched = matched[0]
        return {
            count: 1*matched[1],
            value: stripConditions(matched[0]).trim()
        }
    }).filter((o) => o !== undefined)
    let i = 0;
    //Loop through the solo parts
    while (i < soloParts.length) {
        const p = soloParts[i]
        if (p.count === count) {
            return p.value
        }
        i++;
    }

    //Get ranged pattern parts
    const rangedPattern = /\[(?<start>\d+|\*),(?<end>\d+|\*)][^\|]*/g
    const rangedParts = parts.map(part => {
        let matched = [...part.matchAll(rangedPattern)]
        if (matched.length <= 0) {
            return;
        }
        matched = matched[0]
        return {
            start: parseInt(matched[1]),
            end: parseInt(matched[2]) || true,
            value: matched[0].replace(`[${matched[1]},${matched[2]}]`, '').trim()
        }
    }).filter((o) => o !== undefined)

    i = 0;
    //Loop through the solo parts
    while (i < rangedParts.length) {
        const p = rangedParts[i]

        if (count >= p.start || isNaN(p.start)) {
            if (count <= p.end || p.end === true) {
                return p.value
            }
        }

        i++;
    }

    if(trans.length > 1){
        const index = count == 1 ? 0 : 1;
        return stripConditions(parts[index] ?? parts[0]).trim()
    }

    return sentence
}
