import { trans } from './../dist/translator'
const Lingua = {
    translations: {
        en: {
            php: {
                choice: {
                    concrete_number: '{0} There are none|{5} There are five|[6,9] There are more than five, but less than ten|[10,*] There are more than ten',
                },
                replace: '{1} There is only one user online|[2,*] There are :count users online',
                simpleTransChoice: 'There is one post|There are many posts'
            }
        }
    }
}
const config = {
    Lingua: Lingua,
    locale: 'en'
}


// Solo pattern matching
test('trans is returning second choice option when count is 5', () => {
    expect(trans('choice.concrete_number', { count: 5 }, true, config)).toBe('There are five')
});

test('trans is returning first choice option when count is 0', () => {
    expect(trans('choice.concrete_number', { count: 0 }, true, config)).toBe('There are none')
});
test('trans is returning first simple choice option when count is 1', () => {
    expect(trans('simpleTransChoice', {count: 1}, true, config)).toBe('There is one post')
})
test('trans is returning second simple choice option when count is 5', () => {
    expect(trans('simpleTransChoice', { count: 5 }, true, config)).toBe('There are many posts')
})

//Range pattern matching
test('trans is returning third choice option when count is 6', () => {
    expect(trans('choice.concrete_number', { count: 6 }, true, config)).toBe('There are more than five, but less than ten')
});

test('trans is returning third choice option when count is 8', () => {
    expect(trans('choice.concrete_number', { count: 8 }, true, config)).toBe('There are more than five, but less than ten')
});

test('trans is returning forth choice option when count is 10', () => {
    expect(trans('choice.concrete_number', { count: 10 }, true, config)).toBe('There are more than ten')
});

test('trans is returning forth choice option when count is 15', () => {
    expect(trans('choice.concrete_number', { count: 15 }, true, config)).toBe('There are more than ten')
});


//Choice with replace
test('trans is returning first choice option with replace', () => {
    expect(trans('replace', { count: 1 }, true, config)).toBe('There is only one user online')
});

test('trans is returning second choice option with replace', () => {
    expect(trans('replace', { count: 20 }, true, config)).toBe('There are 20 users online')
});
