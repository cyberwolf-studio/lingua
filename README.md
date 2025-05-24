[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct.svg)](https://stand-with-ukraine.pp.ua)
[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)
[![Russian Warship Go Fuck Yourself](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/RussianWarship.svg)](https://stand-with-ukraine.pp.ua)
[![Made in Ukraine](https://img.shields.io/badge/made_in-ukraine-ffd700.svg?labelColor=0057b7)](https://stand-with-ukraine.pp.ua)

![](./assets/logo.png)

##### Originally based on [Zora](https://github.com/jetstreamlabs/zora), but was hard modified.

# Generate translations into JS file

This library allows you to generate your Laravel translations to your asset pipeline for use in JavaScript packages like
Vue, React and Svelte.

# Installation

First, install the package via composer:

```bash
composer require cyberwolfstudio/lingua
```

Next, run the install command to set up the frontend binding for your framework:

```bash
php artisan lingua:install
```

You will be prompted to select your frontend framework (Vue, React, or Svelte). The corresponding npm package will be installed automatically using your detected package manager (npm, yarn, or pnpm):
- Vue: `@cyberwolf.studio/lingua-vue`
- React: `@cyberwolf.studio/lingua-react`
- Svelte: `@cyberwolf.studio/lingua-svelte`

---

# Usage

In Inertia.js, ensure your current locale is shared with the frontend by adding the following to your `HandleInertiaRequest::share` method:

```php
// app/Http/Middleware/HandleInertiaRequests.php

public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'locale' => fn() => app()->getLocale(),
    ]);
}
```

## Vue

Import and use the Lingua plugin from `@cyberwolf.studio/lingua-vue`:

```js
// main.js or app.js
import { LinguaVue } from '@cyberwolf.studio/lingua-vue';
import { Lingua } from './lingua'; // Your generated translations

const app = createApp(App)
  .use(LinguaVue, { Lingua })
  // ... other plugins

app.mount('#app');
```

You can now use `this.trans`, `this.__`, and `this.transChoice` in your Vue components, or inject them as needed.

## React

Import `LinguaProvider` and `useLingua` from `@cyberwolf.studio/lingua-react`:

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { LinguaProvider, useLingua } from '@cyberwolf.studio/lingua-react';
import { Lingua } from './lingua'; // Your generated translations
import App from './App';

const currentLocale = 'en'; // This should ideally come from your shared Inertia data

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <LinguaProvider locale={currentLocale} Lingua={Lingua}>
    <App />
  </LinguaProvider>
);
```

In your components:

```jsx
import { useLingua } from '@cyberwolf.studio/lingua-react';

function MyComponent() {
  const { trans, transChoice, locale } = useLingua();
  // ...
}
```

## Svelte

Import and initialize Lingua in your Svelte app using `@cyberwolf.studio/lingua-svelte`:

```js
// main.js or a root Svelte component
import { setLingua } from '@cyberwolf.studio/lingua-svelte';
import { Lingua } from './lingua'; // Your generated translations

const initialLocale = 'en'; // This should ideally come from your shared Inertia data
setLingua(initialLocale, Lingua);
```

In your Svelte components:

```svelte
<script>
  import { trans, transChoice, currentLocale } from '@cyberwolf.studio/lingua-svelte';
</script>

<p>{trans('Hello')}</p>
<p>{trans('Welcome :name', { name: 'Svelte User' })}</p>
<p>{transChoice('item', 1)}</p>
<p>{transChoice('item', 5, { user_name: 'Jules' })}</p>
<p>Current locale: {$currentLocale}</p>
```

# Generating Translations

To build your Laravel translations into a JS file, use:

```bash
php artisan lingua:generate
```

This will generate the `Lingua` object for your frontend.

To automate this process during development, you can use a Vite plugin like [vite-plugin-run](https://github.com/innocenzi/vite-plugin-run). Install the plugin and add the following to your `vite.config.js` plugins section:

```js
run({
    name: "generate translations",
    run: ['php', 'artisan', 'lingua:generate'],
    pattern: ['resources/lang/**', 'lang/**'],
})
```

This configuration will automatically run `php artisan lingua:generate` whenever files in `resources/lang` or `lang` directories are changed.

You can also combine this with other commands and specify when the plugin should run. For example, to generate translations and Ziggy routes only during development (when running `vite dev` or `vite serve`):

```js
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

# Changelog

All changes made here will be described in [Changelog.md](./CHANGELOG.md) file.

# Monorepo Structure

The project uses a monorepo structure to manage separate packages for different frontend frameworks. Each framework has its own directory under `packages/`:

- `packages/vue` — VueJS package
- `packages/react` — ReactJS package
- `packages/svelte` — SvelteJS package

Each package is independently managed and can contain its own source code, dependencies, and build scripts. This structure allows for better organization and separation of concerns between different frontend implementations.
