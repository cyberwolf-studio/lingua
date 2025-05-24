import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Lingua Documentation",
  description: "Documentation for the Lingua project",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Frontend Framework Bindings', link: '/packages/' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Automatic Translation Generation', link: '/automatic-translation-generation' }
        ]
      },
      {
        text: 'Frontend Framework Bindings',
        items: [
          { text: 'Core', link: '/packages/core/' },
          { text: 'React', link: '/packages/react/' },
          { text: 'Svelte', link: '/packages/svelte/' },
          { text: 'Vue', link: '/packages/vue/' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cyberwolf-studio/lingua' }
    ]
  }
}) 