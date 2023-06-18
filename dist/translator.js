export const trans = (key, replace, config) => {
    const locale = config.locale
    const Lingua = config.Lingua

    let translation = null

    try {

        translation = key
            .split('.')
            .reduce((t, i) => t[i] || null, Lingua.translations[locale].php)

        if (translation) {
            return checkForVariables(translation, replace)
        }
    } catch (e) {
    }

    try {
        translation = key
            .split('.')
            .reduce((t, i) => t[i] || null, Lingua.translations[locale].json)

        if (translation) {
            return checkForVariables(translation, replace)
        }
    } catch (e) {
    }

    return checkForVariables(key, replace)
}

export const checkForVariables = (translation, replace) => {
    let translated = translation

    if (typeof replace === 'undefined') {
        return translation
    }
    Object.keys(replace).forEach(key => {
        const value = replace[key]
        translated = translated.toString().replace(':' + key, value)
    })
    return translated
}
