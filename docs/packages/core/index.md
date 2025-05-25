# Core Package (@cyberwolf.studio/lingua-core)

The `@cyberwolf.studio/lingua-core` package is the heart of Lingua. It provides the core, framework-agnostic logic for handling translations, pluralization, and replacements.

This package is a dependency for all the framework-specific packages (React, Vue, and Svelte), but it can also be used independently in any JavaScript or TypeScript project.

## Features:

*   **Translation Functionality:** Access and retrieve translation strings based on the current locale.
*   **Pluralization:** Handle complex plural forms based on a given count and locale.
*   **Replacements:** Easily substitute placeholders within translation strings.
*   **Framework Agnostic:** Can be used with any JavaScript framework or no framework at all.

## Installation

The core package is installed automatically when you run `php artisan lingua:install` and select your frontend framework. If you need to install it manually in a different JavaScript/TypeScript project, you can use npm or Yarn:

```bash
npm install @cyberwolf.studio/lingua-core
```

```bash
yarn add @cyberwolf.studio/lingua-core
```

## Usage

The core package primarily exposes the `trans` function, which is used internally by the framework-specific packages and can be used directly if needed.

```javascript
import { trans } from '@cyberwolf.studio/lingua-core';

// Assuming you have your translation data and current locale available
const LinguaData = { /* ... your translation data ... */ };
const currentLocale = 'en';

const translatedString = trans('your.translation.key', { /* replacements */ }, false, { Lingua: LinguaData, locale: currentLocale });

const pluralizedString = trans('your.plural.key', { count: 5 }, true, { Lingua: LinguaData, locale: currentLocale });
```

While you can use the `trans` function directly, it's generally recommended to use the framework-specific bindings for a more integrated experience within your React, Vue, or Svelte applications. 