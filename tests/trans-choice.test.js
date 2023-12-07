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

// These are the test cases from the laravel framework, class Illuminate\Tests\Translation\TranslationMessageSelectorTest
// format: [expected, message, number]
const laravelTranslationMessageSelectorTestData = [
    ['first', 'first', 1],
    ['first', 'first', 10],
    ['first', 'first|second', 1],
    ['second', 'first|second', 10],
    ['second', 'first|second', 0],

    ['first', '{0}  first|{1}second', 0],
    ['first', '{1}first|{2}second', 1],
    ['second', '{1}first|{2}second', 2],
    ['first', '{2}first|{1}second', 2],
    ['second', '{9}first|{10}second', 0],
    ['first', '{9}first|{10}second', 1],
    ['', '{0}|{1}second', 0],
    ['', '{0}first|{1}', 1],
    ['first', '{1.3}first|{2.3}second', 1.3],
    ['second', '{1.3}first|{2.3}second', 2.3],
    [`first
    line`, `{1}first
    line|{2}second`, 1],
    [`first \n
    line`, `{1}first \n
    line|{2}second`, 1],

    ['first', '{0}  first|[1,9]second', 0],
    ['second', '{0}first|[1,9]second', 1],
    ['second', '{0}first|[1,9]second', 10],
    ['first', '{0}first|[2,9]second', 1],
    ['second', '[4,*]first|[1,3]second', 1],
    ['first', '[4,*]first|[1,3]second', 100],
    ['second', '[1,5]first|[6,10]second', 7],
    ['first', '[*,4]first|[5,*]second', 1],
    ['second', '[5,*]first|[*,4]second', 1],
    ['second', '[5,*]first|[*,4]second', 0],

    ['first', '{0}first|[1,3]second|[4,*]third', 0],
    ['second', '{0}first|[1,3]second|[4,*]third', 1],
    ['third', '{0}first|[1,3]second|[4,*]third', 9],

    ['first', 'first|second|third', 1],
    ['second', 'first|second|third', 9],
    ['second', 'first|second|third', 0],

    ['first', '{0}  first | { 1 } second', 0],
    ['first', '[4,*]first | [1,3]second', 100],

]

it.each(laravelTranslationMessageSelectorTestData)('passes laravel test case [%s, %s, %s]', (expected, message, number) => {
    const result = trans(message, { count: number }, true, config)
    expect(result).toBe(expected)
});


/*
test.only('one-by-one', () => {
    const [expected, message, number] = ['first', '{0}  first|{1}second', 0]
    console.log(expected, message, number, 'CASE')
    const result = trans(message, { count: number }, true, config)
    expect(result).toBe(expected)
})
*/