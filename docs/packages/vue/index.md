# Vue Package Documentation

This section covers the @cyberwolf.studio/lingua-vue package. 

# Vue Binding (@cyberwolf.studio/lingua-vue)

The `@cyberwolf.studio/lingua-vue` package provides a Vue plugin to easily integrate Lingua translations into your Vue 3 applications.

## Installation

The Vue package is installed automatically when you run `php artisan lingua:install` and select Vue as your frontend framework. If you need to install it manually:

```bash
npm install @cyberwolf.studio/lingua-vue @cyberwolf.studio/lingua-core
```

```bash
yarn add @cyberwolf.studio/lingua-vue @cyberwolf.studio/lingua-core
```

## Setup

Import the `LinguaVue` plugin and your generated `Lingua` translations data (`./lingua.js`). Use the `app.use()` method to install the plugin, passing the `Lingua` data as an option.

```javascript
// main.js or app.js
import { createApp } from 'vue';
import { LinguaVue } from '@cyberwolf.studio/lingua-vue';
import { Lingua } from './lingua'; // Your generated translations
import App from './App';

const app = createApp(App)
  .use(LinguaVue, { Lingua })
  // ... other plugins

app.mount('#app');
```

Ensure that your Laravel application is sharing the current locale with the frontend, especially if you are using Inertia.js. The Vue binding will automatically pick up the locale from Inertia's shared data. Refer to the [Sharing Locale with Frontend (Inertia.js)](#) section in the Getting Started guide.

## Usage

Once the plugin is installed, you can access the translation functions `trans`, `__`, and `transChoice` via the global properties (`this.$trans`, etc.) or by injecting them using `inject` in the Composition API.

Using Options API (within components):

```vue
<template>
  <div>
    <p>{{ trans('your.translation.key') }}</p>
    <p>{{ __('another.key', { name: 'User' }) }}</p>
    <p>{{ transChoice('item', 1) }}</p>
  </div>
</template>

<script>
export default {
  // ... component options
};
</script>
```

Using Composition API (within `setup()`):

```vue
<script setup>
import { inject } from 'vue';

const trans = inject('trans');
const transChoice = inject('transChoice');
const locale = inject('locale'); // Injected from the plugin

// Use trans, transChoice, and locale in your setup logic
</script>

<template>
  <div>
    <p>{{ trans('your.translation.key') }}</p>
    <p>{{ transChoice('item', 5) }}</p>
    <p>Current locale: {{ locale }}</p>
  </div>
</template>
``` 