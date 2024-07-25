export const trans = (key, replace, pluralize, config) => {
    const locale = config.locale.toLowerCase()
    const Lingua = config.Lingua

    let translation = null

    try {
        translation =
            Lingua.translations[locale].php?.[key] ??
            key.split('.')
            .reduce((t, i) => t[i] || null, Lingua.translations[locale].php)

        if (translation) {
            return translate(translation, replace, pluralize)
        }
    } catch (e) {
    }

    try {
        translation =
            Lingua.translations[locale].json?.[key] ??
            key.split('.')
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

const stripConditions = (sentence) => {
    const ret =  sentence.replace(/^[\{\[]([^\[\]\{\}]*)[\}\]]/, '')
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
