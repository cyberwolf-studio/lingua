/**
 * TODO: Refactor this test code.
 * This test suite code is written just to check if code is working properly.
 * There is a better way to organize these code.
 *
 * Things that should be done:
 * 1) Test changing locale
 * 2) Split tests or domains
 * 3) Test VueJS integration
 *
 */
import { trans } from './../dist/translator'
const Lingua = {
    translations: {
        en: {
            php: {
                dashboard: 'Dashboard',
                replace: 'Welcome, :user',
                choice: {
                    three: '{0} There are none|[1,19] There are some|[20,*] There are many',
                    two: '[1,19] There are some|[20,*] There are many',
                    one: '[1,19] There are some'
                },
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


test('trans is returning second choice if count is 10', () => {
    expect(trans('choice.three', { count: 10 }, true, config)).toBe('There are some')
});

test('trans is returning first choice if count is 0', () => {
    expect(trans('choice.three', { count: 0 }, true, config)).toBe('There are none')
});

test('trans is returning third choice if count is more than 20', () => {
    expect(trans('choice.three', { count: 25 }, true, config)).toBe('There are many')
});


test('trans is returning sentence choice if count is 0', () => {
    expect(trans('choice.two', { count: 0 }, true, config)).toBe('[1,19] There are some|[20,*] There are many')
});
