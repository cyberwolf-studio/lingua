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


    // if (parts.length >= 3) parts = [parts[0], parts[1], parts[2]]
    // else if (parts.length === 2) parts = [parts[0], parts[0], parts[1]]
    // else parts = [parts[0], parts[0], parts[0]]

    // // Manage multiple number range.
    // let ranges = []
    // const pattern = /^(\[(\s*\d+\s*)+,(\s*(\d+|\*)\s*)])|({\s*\d+\s*})/

    // for (let i = 0; i < parts.length; i++) {
    //     let part = parts[i]
    //     let matched = part.match(pattern)
    //     console.log(matched)

    //     if (matched === null) {
    //         // If range is found, use the part index as the range.
    //         parts[i] = `{${i}} ${parts[i]}`
    //         matched = [parts[i]]
    //     }

    //     // Remove unwanted characters: "[",  "]",  "{",  "}"
    //     const replaced = matched[0].replace(/[\[{\]}]/, '')
    //     // Split the matched to have an array of string number
    //     const rangeNumbers = replaced.split(',').map(m => {
    //         const parsed = Number.parseInt(m.trim())
    //         // If parsed is a star(*) which mean infinity, just replace by count + 1
    //         return Number.isInteger(parsed) ? parsed : count + 1
    //     })

    //     // Lets make sure to remove the range symbols in the parts.
    //     parts[i] = part = part.replace(pattern, '')

    //     ranges.push(
    //         rangeNumbers.length == 1
    //             ? { min: rangeNumbers[0], max: rangeNumbers[0], part }
    //             : { min: rangeNumbers[0], max: rangeNumbers[1], part }
    //     )
    // }

    // let foundInRange = false
    // // Compare the part with the range to choose the pluralization.
    // // -------  ------
    // // Return the first part if count is zero or negative
    // if (count <= 0) {
    //     sentence = parts[0]
    // } else {
    //     for (const range of ranges) {
    //         // If count is in the range, return the corresponding text part.
    //         if (count >= range.min && count <= range.max) {
    //             // count is in the range.
    //             sentence = range.part
    //             foundInRange = true
    //             break
    //         }
    //     }
    //     if (!foundInRange) {
    //         // If count is not in the range, we use the last part.
    //         sentence = parts[parts.length - 1]
    //     }
    // }

    return sentence
}
