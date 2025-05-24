# Getting Started

This guide will help you get started with Lingua and integrate it into your project.

Lingua is designed to integrate seamlessly with your Laravel application to provide translation capabilities to your frontend framework. The primary setup involves installing the Lingua PHP package and then the necessary frontend packages.

## 1. PHP Package Installation

First, install the Lingua PHP package in your Laravel project using Composer:

```bash
composer require cyberwolfstudio/lingua
```

After installing the Composer package, run the Lingua install command to set up the necessary frontend bindings and install the corresponding npm package for your framework:

```bash
php artisan lingua:install
```

This interactive command will prompt you to select your frontend framework (Vue, React, or Svelte) and automatically install the correct npm package (`@cyberwolf.studio/lingua-vue`, `@cyberwolf.studio/lingua-react`, or `@cyberwolf.studio/lingua-svelte`) using your detected package manager (npm, yarn, or pnpm).

## 2. Sharing Locale with Frontend (Inertia.js)

If you are using Inertia.js, ensure your current locale is shared with the frontend by adding the following to your `HandleInertiaRequest::share` method:

```php
// app/Http/Middleware/HandleInertiaRequests.php

public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'locale' => fn() => app()->getLocale(),
    ]);
}
```

## 3. Generating Translations

To make your Laravel translations available to the frontend, you need to generate them into a JavaScript file. Use the following Artisan command:

```bash
php artisan lingua:generate
```

This command will create a JavaScript file (typically `./lingua.js`) containing your translations.

For automating this during development, you can use build tool plugins to regenerate translations whenever your language files change. See our [Automatic Translation Generation](/automatic-translation-generation) guide for detailed instructions and examples.

## 4. Frontend Framework Setup