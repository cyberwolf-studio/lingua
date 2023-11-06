import {trans} from './translator.js'
import {computed} from "vue";
import { usePage } from '@inertiajs/vue3'

// prettier-ignore
export const LinguaVue = {
    install: (v, options) => {
        const locale = computed(() => usePage().props?.locale)
        const configuration = computed(() => ({
            locale: locale.value,
            Lingua: options.Lingua
        }))

        const translationCallback = (key, replace, config = configuration) => trans(key, replace, false, {
            Lingua: configuration.value.Lingua,
            locale: configuration.value.locale
        })

        const translationWithPluralizationCallback = (key, replace, config = configuration) => trans(key, replace, true, {
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
        v.provide('locale', locale)
        return v
    }
}
