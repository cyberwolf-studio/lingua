export const trans = (key, replace, pluralize, config) => {
    const locale = config.locale
    const Lingua = config.Lingua

    let translation = null

    try {
        translation = key
            .split('.')
            .reduce((t, i) => t[i] || null, Lingua.translations[locale].php)

        if (translation) {
            return translate(translation, replace, pluralize)
        }
    } catch (e) {
    }

    try {
        translation = key
            .split('.')
            .reduce((t, i) => t[i] || null, Lingua.translations[locale].json)

        if (translation) {
            return translate(translation, replace, pluralize)
        }
    } catch (e) {
    }

    return translate(key, replace, pluralize)
}

const translate = (translation, replace, shouldPluralize) => {
    let translated = shouldPluralize ? pluralize(translation, replace.count) : translation

    if (typeof replace === 'undefined') {
        return translation
    }

    Object.keys(replace).forEach(key => {
        const value = replace[key]
        translated = translated.toString().replace(':' + key, value)
    })

    return translated
}


const pluralize = (sentence, count) => {
    let parts = sentence.split('|')
    const pattern = /\[(?<start>\d+),(?<end>.*)]/gm
    parts = {
        zero: parts.find(p => p.includes('{0}'))?.replace('{0}', '').trim(),
        ...parts.filter(p => !p.includes('{0}')).reduce((acc, p) => {
            const matched = [...p.matchAll(pattern)][0]
            return {
                ...acc,
                [matched?.groups.end]: p
            }
        }, [])
    }

    if (count == 0) {
        return parts.zero || sentence
    }

    const translate = Object.keys(parts).filter(k => k != 'zero' && k !== '*').reduce((acc, key) => {
        if (count <= parseInt(key)) {
            return parts[key]
        }
    }, [])

    if (!translate) {
        return parts['*'].replace(pattern, '').trim() || sentence
    }

    return translate.replace(pattern, '').trim()
}
