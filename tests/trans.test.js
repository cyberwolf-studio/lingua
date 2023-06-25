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

test('trans is replacing key', () => {
    expect(trans('replace', { user: 'World' }, false, config)).toBe('Welcome, World')
});
