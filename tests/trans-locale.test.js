import { trans } from './../dist/translator'
const Lingua = {
    translations: {
        en: {
            php: {
                dashboard: 'Dashboard',
                replace: 'Welcome, :user',
            }
        },
        ua: {
            php: {
                dashboard: 'Дашборд',
                replace: 'Привіт, :user',
            }
        }
    }
}

test('trans is translating en string', () => {
    expect(trans('dashboard', {}, false, {
        Lingua,
        locale: 'en'
    })).toBe('Dashboard')
});

test('trans is translating ua string', () => {
    expect(trans('dashboard', {}, false, {
        Lingua,
        locale: 'ua'
    })).toBe('Дашборд')
});

test('trans is translating en string with replace', () => {
    expect(trans('replace', {
        user: 'user'
    }, false, {
        Lingua,
        locale: 'en'
    })).toBe('Welcome, user')
});

test('trans is translating ua string with replace', () => {
    expect(trans('replace', {
        user: 'користувачу'
    }, false, {
        Lingua,
        locale: 'ua'
    })).toBe('Привіт, користувачу')
});
