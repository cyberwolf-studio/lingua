import {trans} from './translator.js'
import {computed, ref} from "vue";
// prettier-ignore
export const LinguaVue = {
    install: (v, options) => {
        const locale = ref(options.locale)
        const configuration = computed(() => ({
            locale: locale.value,
            Lingua: options.Lingua
        }))

        const translationCallback = (key, replace, config = configuration) => trans(key, replace, {
            Lingua: configuration.value.Lingua,
            locale: configuration.value.locale
        })

        const translationWithPluralizationCallback = (key, replace, config = configuration) => trans(key, replace, {
            Lingua: configuration.value.Lingua,
            locale: configuration.value.locale
        })

        v.mixin({
            methods: {
                __: translationCallback,
                trans: translationCallback,
                transChoice: translationWithPluralizationCallback
            }
        });
        v.provide('trans', translationCallback)
        v.provide('transChoice', translationWithPluralizationCallback)
        v.provide('setLocale', (loc) => {
            locale.value = loc
        })
        v.provide('locale', locale)
        return v
    }
}
