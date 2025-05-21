import { get } from 'svelte/store';
import { setLingua, transSvelte, transChoiceSvelte, currentLocale, linguaData } from '../dist/svelte.js';

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

  test('transSvelte correctly translates a simple key after setLingua', () => {
    setLingua('en', mockLinguaData);
    expect(transSvelte('welcome')).toBe('Welcome');
  });

  test('transSvelte correctly replaces placeholders', () => {
    setLingua('en', mockLinguaData);
    expect(transSvelte('hello', { name: 'Svelte User' })).toBe('Hello Svelte User!');
  });

  test('transChoiceSvelte correctly handles singular form', () => {
    setLingua('en', mockLinguaData);
    expect(transChoiceSvelte('plural_test', 1)).toBe('item');
  });

  test('transChoiceSvelte correctly handles plural form', () => {
    setLingua('en', mockLinguaData);
    expect(transChoiceSvelte('plural_test', 5)).toBe('items');
  });
  
  test('transChoiceSvelte correctly replaces placeholders and handles plural form', () => {
    mockLinguaData.translations.en.json.plural_test_replace = 'one :thing|many :things';
    setLingua('en', mockLinguaData);
    expect(transChoiceSvelte('plural_test_replace', 5, { thing: 'widget' })).toBe('many widgets');
    delete mockLinguaData.translations.en.json.plural_test_replace; // Clean up
  });

  test('translations react to changes in currentLocale via setLingua', () => {
    setLingua('en', mockLinguaData);
    expect(transSvelte('welcome')).toBe('Welcome');
    expect(transSvelte('hello', { name: 'Test' })).toBe('Hello Test!');
    expect(transChoiceSvelte('plural_test', 10)).toBe('items');

    setLingua('es', mockLinguaData);
    expect(get(currentLocale)).toBe('es');
    expect(transSvelte('welcome')).toBe('Bienvenido');
    expect(transSvelte('hello', { name: 'Prueba' })).toBe('Hola Prueba!');
    expect(transChoiceSvelte('plural_test', 10)).toBe('artículos');
  });

  test('transSvelte returns key if Lingua not initialized (no locale)', () => {
    // No setLingua called, or locale is null
    expect(transSvelte('welcome')).toBe('welcome');
  });

  test('transSvelte returns key if Lingua not initialized (empty Lingua data)', () => {
    setLingua('en', {}); // Empty Lingua data
    expect(transSvelte('welcome')).toBe('welcome');
  });
  
  test('transSvelte returns key if key does not exist in current locale', () => {
    setLingua('en', mockLinguaData);
    expect(transSvelte('non_existent_key')).toBe('non_existent_key');
  });

  test('transChoiceSvelte returns key if Lingua not initialized (no locale)', () => {
    expect(transChoiceSvelte('plural_test', 1)).toBe('plural_test');
  });
  
  test('transChoiceSvelte returns key if key does not exist for pluralization', () => {
    setLingua('en', mockLinguaData);
    expect(transChoiceSvelte('non_existent_plural_key', 5)).toBe('non_existent_plural_key');
  });
});
