import { describe, it, expect } from 'vitest';
import { trans } from '@lingua/core';

describe('VueJS translation integration', () => {
  const Lingua = {
    translations: {
      en: {
        php: {
          greeting: 'Hello, Vue!',
          welcome: 'Welcome, :user!',
        }
      },
      fr: {
        php: {
          greeting: 'Bonjour, Vue!',
        }
      }
    }
  };

  it('should translate a simple key', () => {
    expect(trans('greeting', {}, false, { Lingua, locale: 'en' })).toBe('Hello, Vue!');
  });

  it('should translate with replacements', () => {
    expect(trans('welcome', { user: 'Alice' }, false, { Lingua, locale: 'en' })).toBe('Welcome, Alice!');
  });

  it('should return the key if missing', () => {
    expect(trans('missing_key', {}, false, { Lingua, locale: 'en' })).toBe('missing_key');
  });

  it('should translate for a different locale', () => {
    expect(trans('greeting', {}, false, { Lingua, locale: 'fr' })).toBe('Bonjour, Vue!');
  });

  it('should handle pluralization', () => {
    const LinguaPlural = {
      translations: {
        en: {
          php: {
            posts: 'There is one post|There are many posts',
            users: '{1}There is only one user online|[2,*]There are :count users online'
          }
        }
      }
    };
    expect(trans('posts', { count: 1 }, true, { Lingua: LinguaPlural, locale: 'en' })).toBe('There is one post');
    expect(trans('posts', { count: 5 }, true, { Lingua: LinguaPlural, locale: 'en' })).toBe('There are many posts');
    expect(trans('users', { count: 1 }, true, { Lingua: LinguaPlural, locale: 'en' })).toBe('There is only one user online');
    expect(trans('users', { count: 20 }, true, { Lingua: LinguaPlural, locale: 'en' })).toBe('There are 20 users online');
  });
}); 