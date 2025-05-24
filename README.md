[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct.svg)](https://stand-with-ukraine.pp.ua)
[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)
[![Russian Warship Go Fuck Yourself](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/RussianWarship.svg)](https://stand-with-ukraine.pp.ua)
[![Made in Ukraine](https://img.shields.io/badge/made_in-ukraine-ffd700.svg?labelColor=0057b7)](https://stand-with-ukraine.pp.ua)

![](./assets/logo.png)

##### Originally based on [Zora](https://github.com/jetstreamlabs/zora), but was hard modified.

# Generate translations into JS file

This library allows you to generate your Laravel translations to your asset pipeline for use in JavaScript packages like
Vue. (React coming soon)

# Requirements

* **Laravel**: ^9.* or higher
* **InertiaJS**: ^1.*
* **VueJS**: ^3.*
* **ViteJS**: ^3.*

## Installation

First, install the package via composer:

``` bash
composer require cyberwolfstudio/lingua
```

The package will automatically register itself.

Next add an alias to your `vite.config.js`

```js
 resolve: {
    alias: {
        ...
        'lingua-js': resolve(__dirname, 'vendor/cyberwolfstudio/lingua/dist/index.js')
    },
},
```

To build your Laravel translation into JS file, use:
```bash
php artisan lingua:generate
```

You can automate that process as you wish.
But we recommend you a vite plugin called [vite-plugin-run](https://github.com/innocenzi/vite-plugin-run)
Install it using you package manager and just add this lines to your `vite.config.js` plugins section.
```js
 run({
    name: "generate translations",
    run: ['php', 'artisan', 'lingua:generate'],
    pattern: ['resources/lang/**', 'lang/**'],
})
```

Example of usage: (running only at serve process)
```
{
            ...run([
                {
                    name: 'generate translations',
                    run: ['php', 'artisan', 'lingua:generate'],
                    pattern: ['resources/lang/**', 'lang/**'],
                },
                {
                    name: 'generate ziggy',
                    run: ['php', 'artisan', 'ziggy:generate'],
                    pattern: ['routes/**'],
                }
            ]),
            apply: 'serve'
        }
```



### VueJS

In your `resources/js/app.js` and (if you use SSR) `resources/js/ssr.js` add imports

```js
import { LinguaVue } from 'lingua-js'
import { Lingua } from './lingua'
```
and register LinguaVue plugin

```js
...
.use(LinguaVue, {
    Lingua
})
```

Add `locale` key into your `HandleInertiaRequest::share` method

```php
[
    ...
    locale' => fn() => app()->getLocale(),
    ...
]
```
That's how your application will know your initial locale.

### React

To use Lingua with React, you need to import `LinguaProvider` and `useLingua` from the React bindings.

First, ensure you have your translations generated (e.g., as `Lingua` object, typically in a `lingua.js` file).

In your main application file (e.g., `app.jsx` or `main.jsx`):

```jsx
// Example: resources/js/app.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { LinguaProvider } from 'lingua-js/dist/react.js'; // Adjust path if necessary
import { Lingua } from './lingua'; // Your generated translations
import App from './App'; // Your main React app component

// Assuming you get the initial locale from your backend, similar to the Laravel setup
// This might be passed via props to your root component or fetched.
// For this example, let's assume it's available as `initialPage.props.locale`
// which is common in Inertia.js setups.
const initialPage = JSON.parse(document.getElementById('app').dataset.page);
const currentLocale = initialPage.props.locale || 'en'; // Fallback to 'en'

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <LinguaProvider locale={currentLocale} Lingua={Lingua}>
    <App />
  </LinguaProvider>
);
```

The `Lingua` data object should be structured as follows (this is automatically handled by `php artisan lingua:generate`):
```js
// Example structure of the Lingua object (e.g., in lingua.js)
export const Lingua = {
    translations: {
        en: {
            php: {
                "Hello": "Hello",
                "Welcome :name": "Welcome :name"
            },
            json: {
                "A simple string.": "A simple string.",
                "Hello from JSON!": "Hello from JSON!"
            }
        },
        // ...other locales
    }
    // Potentially other Lingua configuration data
};
```

Then, in your React components, you can use the `useLingua` hook:

```jsx
// Example: ./MyComponent.jsx
import React from 'react';
import { useLingua } from 'lingua-js/dist/react.js'; // Adjust path if necessary

function MyComponent() {
  const { trans, transChoice, locale } = useLingua();

  return (
    <div>
      <p>{trans('Hello')}</p>
      <p>{trans('Welcome :name', { name: 'React User' })}</p>
      {/* For transChoice, the second argument is the count for pluralization. */}
      {/* The third (optional) argument is an object for any other replacements. */}
      {/* The :count placeholder is automatically available based on the number passed as the second argument. */}
      <p>{transChoice('item', 1)}</p> {/* Assuming 'item' key is like '1 item|:count items' or 'apple|apples' */}
      <p>{transChoice('item', 5, { user_name: 'Jules' })}</p> {/* Example with additional replacements like :user_name */}
      <p>Current locale: {locale}</p>
    </div>
  );
}

export default MyComponent;
```

Remember to adjust the import paths for `lingua-js/dist/react.js` and `./lingua` based on your project's structure and how you've set up aliases if any. The `lingua-js` alias in the example `vite.config.js` points to `index.js`, not directly to the `dist` folder, so direct pathing is shown here.


### Svelte

To use Lingua with Svelte, you'll import `setLingua`, `transSvelte`, `transChoiceSvelte`, and the `currentLocale` store from the Svelte bindings.

First, ensure you have your translations generated (e.g., as `Lingua` object, typically in a `lingua.js` file).

Initialize Lingua, typically in your main Svelte setup (e.g., `app.js` or near your root component's script section, or in a layout component).

```javascript
// Example: resources/js/app.js (or a root Svelte component's script)
import { setLingua } from 'lingua-js/dist/svelte.js'; // Adjust path if necessary
import { Lingua } from './lingua'; // Your generated translations

// Assuming you get the initial locale from your backend.
// This might be passed via props or fetched.
// For this example, let's assume `initialLocale` is available.
const initialLocale = 'en'; // Replace with your actual mechanism to get locale

setLingua(initialLocale, Lingua);
```

The `Lingua` data object (second argument to `setLingua`) should be structured as shown in the React or Vue.js examples (automatically handled by `php artisan lingua:generate`).

Then, in your Svelte components, you can use the translation functions and the `currentLocale` store (often with Svelte's auto-subscription `$store` syntax):

```svelte
<!-- Example: MyComponent.svelte -->
<script>
  import { transSvelte, transChoiceSvelte, currentLocale } from 'lingua-js/dist/svelte.js'; // Adjust path
  // Or if you prefer reactive statements for non-auto-subscribed usage:
  // import { get } from 'svelte/store';
  // const t = (key, replacements) => transSvelte(key, replacements);
  // const tc = (key, number, replacements) => transChoiceSvelte(key, number, replacements);
</script>

<div>
  <p>{$transSvelte('Hello')}</p>
  <p>{$transSvelte('Welcome :name', { name: 'Svelte User' })}</p>
  
  <!-- Example for pluralization, assuming 'item' key is set up with plural forms -->
  <!-- For transChoiceSvelte, the second argument is the count for pluralization. -->
  <!-- The third (optional) argument is an object for any other replacements. -->
  <!-- The :count placeholder is automatically available based on the number passed as the second argument. -->
  <p>{$transChoiceSvelte('item', 1)}</p> <!-- Assuming 'item' key is like '1 item|:count items' or 'apple|apples' -->
  <p>{$transChoiceSvelte('item', 5, { user_name: 'Jules' })}</p> <!-- Example with additional replacements like :user_name -->
  
  <p>Current locale: {$currentLocale}</p>
</div>

<!--
  If you are not using Vite or a preprocessor that supports Svelte's auto-subscription
  for imported stores directly in the template, you might need to assign them to local
  variables in the script tag first, or use get(currentLocale), etc.
  However, with typical Svelte setups (especially with Vite), $store syntax should work.

  For non-auto-subscribed usage (less common for display):
  <p>Current locale: {get(currentLocale)}</p>
  <p>{transSvelte('Hello')}</p>
-->
```

Remember to adjust the import paths for `lingua-js/dist/svelte.js` and `./lingua` based on your project's structure. The `lingua-js` alias in the example `vite.config.js` points to `index.js`, so direct pathing to `dist/svelte.js` is shown.

## Usage


## Usage

In your template tag use it in Laravel style, like

```js
__(key: string, replacers: array)

//or

trans(key: string, replacers: array)
```

You can also use trans in your `setup` function by injecting it.

```js
const trans = inject('trans') 
```

# Changelog

All changes made here will be described in [Changelog.md](./CHANGELOG.md) file.

## Monorepo Structure

The project now uses a monorepo structure to manage separate packages for different frontend frameworks. Each framework has its own directory under `packages/`:

- `packages/vuejs` — VueJS package
- `packages/reactjs` — ReactJS package
- `packages/sveltejs` — SvelteJS package

Each package is independently managed and can contain its own source code, dependencies, and build scripts. This structure allows for better organization and separation of concerns between different frontend implementations.
