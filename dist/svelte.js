import { writable, get } from 'svelte/store';
import { trans as linguaTrans } from './translator.js';

// Svelte Stores
const currentLocale = writable(null);
const linguaData = writable({});

// Setup Function
const setLingua = (locale, Lingua) => {
  currentLocale.set(locale);
  linguaData.set(Lingua);
};

// Translation Functions
const transSvelte = (key, replacements = {}) => {
  const locale = get(currentLocale);
  const Lingua = get(linguaData);
  if (!locale || !Lingua || Object.keys(Lingua).length === 0) {
    // console.warn('Lingua not initialized. Call setLingua first.');
    return key; // Return key as fallback if not initialized
  }
  // Call linguaTrans with pluralizeBoolean = false
  return linguaTrans(key, replacements, false, { Lingua, locale });
};

const transChoiceSvelte = (key, number, replacements = {}) => {
  const locale = get(currentLocale);
  const Lingua = get(linguaData);
  if (!locale || !Lingua || Object.keys(Lingua).length === 0) {
    // console.warn('Lingua not initialized. Call setLingua first.');
    return key; // Return key as fallback
  }
  // Add count to replacements and call linguaTrans with pluralizeBoolean = true
  const newReplacements = { ...replacements, count: number };
  return linguaTrans(key, newReplacements, true, { Lingua, locale });
};

export { currentLocale, linguaData, setLingua, transSvelte, transChoiceSvelte };
