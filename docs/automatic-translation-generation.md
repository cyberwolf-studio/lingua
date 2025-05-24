# Automatic Translation Generation

To keep your frontend translations up-to-date with your Laravel language files during development, you can automate the process of running `php artisan lingua:generate` using build tool plugins.

This guide will show you how to use `vite-plugin-run` with Vite.

## Using vite-plugin-run

If you are using Vite as your build tool, you can use the `vite-plugin-run` package to automatically run `php artisan lingua:generate` whenever your language files change.

First, install the plugin:

```bash
npm install vite-plugin-run --dev
# or
yarn add vite-plugin-run --dev
# or
pnpm add vite-plugin-run --dev
```

Then, add the following to your `vite.config.js` plugins section:

```js
import { run } from 'vite-plugin-run';

export default {
  plugins: [
    run({
      name: "generate translations",
      run: ['php', 'artisan', 'lingua:generate'],
      pattern: ['resources/lang/**', 'lang/**'],
    }),
  ],
};
```

This configuration will automatically run `php artisan lingua:generate` whenever files in the `resources/lang` or `lang` directories are changed.

### Running only during development

You can also combine this with other commands and specify when the plugin should run. For example, to generate translations and Ziggy routes only during development (when running `vite dev` or `vite serve`):

```js
import { run } from 'vite-plugin-run';

export default {
  plugins: [
    run([
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
    // Apply this configuration only during development server run
    apply: 'serve'
  ],
};
``` 