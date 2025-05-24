import { get } from 'svelte/store';
import { setLingua, trans, transChoice, currentLocale, linguaData } from './index.js';

const mockLinguaData = {
  translations: {
    en: {
      php: { 'hello': 'Hello :name!', 'welcome': 'Welcome' },
      json: { 'plural_test': 'item|items', 'greeting': 'Good morning' }
    },
    es: {
      php: { 'hello': 'Hola :name!', 'welcome': 'Bienvenido' },
      json: { 'plural_test': 'artículo|artículos', 'greeting': 'Buenos días' }
    },
  },
};

describe('Svelte Lingua Bindings', () => {
  beforeEach(() => {
    // Reset stores before each test
    setLingua(null, {}); 
  });

  test('setLingua correctly updates currentLocale and linguaData stores', () => {
    setLingua('en', mockLinguaData);
    expect(get(currentLocale)).toBe('en');
    expect(get(linguaData)).toEqual(mockLinguaData);
  });

  test('svelte trans correctly translates a simple key after setLingua', () => {
    setLingua('en', mockLinguaData);
    expect(trans('welcome')).toBe('Welcome');
  });

  test('svelte trans correctly replaces placeholders', () => {
    setLingua('en', mockLinguaData);
    expect(trans('hello', { name: 'Svelte User' })).toBe('Hello Svelte User!');
  });

  test('svelte transChoice correctly handles singular form', () => {
    setLingua('en', mockLinguaData);
    expect(transChoice('plural_test', 1)).toBe('item');
  });

  test('svelte transChoice correctly handles plural form', () => {
    setLingua('en', mockLinguaData);
    expect(transChoice('plural_test', 5)).toBe('items');
  });
  
  test('svelte transChoice correctly replaces placeholders and handles plural form', () => {
    mockLinguaData.translations.en.json.plural_test_replace = 'one :thing|many :things';
    setLingua('en', mockLinguaData);
    expect(transChoice('plural_test_replace', 5, { thing: 'widget' })).toBe('many widgets');
    delete mockLinguaData.translations.en.json.plural_test_replace; // Clean up
  });

  test('svelte translations react to changes in currentLocale via setLingua', () => {
    setLingua('en', mockLinguaData);
    expect(trans('welcome')).toBe('Welcome');
    expect(trans('hello', { name: 'Test' })).toBe('Hello Test!');
    expect(transChoice('plural_test', 10)).toBe('items');

    setLingua('es', mockLinguaData);
    expect(get(currentLocale)).toBe('es');
    expect(trans('welcome')).toBe('Bienvenido');
    expect(trans('hello', { name: 'Prueba' })).toBe('Hola Prueba!');
    expect(transChoice('plural_test', 10)).toBe('artículos');
  });

  test('svelte trans returns key if Lingua not initialized (no locale)', () => {
    // No setLingua called, or locale is null
    expect(trans('welcome')).toBe('welcome');
  });

  test('svelte trans returns key if Lingua not initialized (empty Lingua data)', () => {
    setLingua('en', {}); // Empty Lingua data
    expect(trans('welcome')).toBe('welcome');
  });
  
  test('svelte trans returns key if key does not exist in current locale', () => {
    setLingua('en', mockLinguaData);
    expect(trans('non_existent_key')).toBe('non_existent_key');
  });

  test('svelte transChoice returns key if Lingua not initialized (no locale)', () => {
    expect(transChoice('plural_test', 1)).toBe('plural_test');
  });
  
  test('svelte transChoice returns key if key does not exist for pluralization', () => {
    setLingua('en', mockLinguaData);
    expect(transChoice('non_existent_plural_key', 5)).toBe('non_existent_plural_key');
  });
});
