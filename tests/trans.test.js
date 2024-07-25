/**
 * TODO: Refactor this test code.
 * This test suite code is written just to check if code is working properly.
 * There is a better way to organize these code.
 *
 * Things that should be done:
 * 1) Test VueJS integration
 *
 */
import { trans } from './../dist/translator'
const Lingua = {
    translations: {
        en: {
            php: {
                dashboard: 'Dashboard',
                replace: 'Welcome, :user',
                settings: {
                    title: 'Settings',
                }
            }
        },
        pl: {
            php: {
                dashboard: 'Panel',
                "Please enter your email address.": "Proszę podaj swój adres email.",
            }
        }
    }
}
const config = {
    Lingua: Lingua,
    locale: 'en'
}


test('trans is translating string', () => {
    expect(trans('dashboard', {}, false, config)).toBe('Dashboard')
});

test('trans is translating nested object', () => {
    expect(trans('settings.title', {}, false, config)).toBe('Settings')
});

test("trans is translating key containing dot character", () => {
    const configPl = {
        Lingua: Lingua,
        locale: "pl",
    };
    expect(trans("Please enter your email address.", {}, false, configPl)).toBe(
        "Proszę podaj swój adres email."
    );
});

test('trans is replacing key', () => {
    expect(trans('replace', { user: 'World' }, false, config)).toBe('Welcome, World')
});

// @deprecated This test does not make sense. Locale should be case sensitive. (can be en-US for example)
// test('trans is working with locale uppercase', () => {
//     const uppercaseConfig = {
//         Lingua: Lingua,
//         locale: "PL"
//     }
//     expect(trans('dashboard', {}, false, uppercaseConfig)).toBe('Panel')
// })
