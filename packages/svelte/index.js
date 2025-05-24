import { writable, get } from 'svelte/store';
import { trans } from '@cyberwolf.studio/lingua-core';

// Svelte Stores
const currentLocale = writable(null);
const linguaData = writable({});

// Setup Function
const setLingua = (locale, Lingua) => {
  currentLocale.set(locale);
  linguaData.set(Lingua);
};


const translationCallback = (key, replacements) => {
  const locale = get(currentLocale);
  const Lingua = get(linguaData);

  if (!locale || !Lingua || Object.keys(Lingua).length === 0) {
    console.warn('Lingua not initialized. Call setLingua first.');
    return key; // Return key as fallback if not initialized
  }

  return trans(key, replacements, false, {
    Lingua,
    locale
  })
}


const translationWithPluralizationCallback = (key, number, replacements) => {
  const locale = get(currentLocale);
  const Lingua = get(linguaData);

  if (!locale || !Lingua || Object.keys(Lingua).length === 0) {
    console.warn('Lingua not initialized. Call setLingua first.');
    return key; // Return key as fallback if not initialized
  }
  const newReplacements = { ...replacements, count: number };
  return trans(key, newReplacements, true, {
    Lingua,
    locale
  })
}

export {
  currentLocale,
  linguaData,
  setLingua,
  translationCallback as trans,
  translationCallback as __,
  translationWithPluralizationCallback as transChoice,
};
