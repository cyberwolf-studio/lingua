# React Package Documentation

This section covers the @cyberwolf.studio/lingua-react package. 

# React Binding (@cyberwolf.studio/lingua-react)

The `@cyberwolf.studio/lingua-react` package provides a seamless way to integrate Lingua translations into your React applications.

It provides a `LinguaProvider` component and a `useLingua` hook for accessing translation functions and the current locale within your React components.

## Installation

The React package is installed automatically when you run `php artisan lingua:install` and select React as your frontend framework. If you need to install it manually:

```bash
npm install @cyberwolf.studio/lingua-react @cyberwolf.studio/lingua-core
```

```bash
yarn add @cyberwolf.studio/lingua-react @cyberwolf.studio/lingua-core
```

## Setup

Wrap your root React component with the `LinguaProvider` and pass the current `locale` and your generated `Lingua` translations data to it.

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { LinguaProvider } from '@cyberwolf.studio/lingua-react';
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

Ensure that your Laravel application is sharing the current locale with the frontend, especially if you are using Inertia.js. Refer to the [Sharing Locale with Frontend (Inertia.js)](#) section in the Getting Started guide.

## Usage

Use the `useLingua` hook within your functional components to access the `trans` and `transChoice` translation functions, as well as the current `locale`.

```jsx
import { useLingua } from '@cyberwolf.studio/lingua-react';

function MyComponent() {
  const { trans, transChoice, locale } = useLingua();

  return (
    <div>
      <p>{trans('your.translation.key')}</p>
      <p>{trans('another.key', { name: 'User' })}</p>
      <p>{transChoice('item', 1)}</p>
      <p>Current locale: {locale}</p>
    </div>
  );
}
``` 