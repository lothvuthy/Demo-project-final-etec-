// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      bakongApiBase: '',
    },
  },

  // GitHub Pages serves project sites below /<repository-name>/.
  app: {
    baseURL: '/Demo-project-final-etec-/',
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          // Bricolage Grotesque = headings, Figtree = body, Kantumruy Pro = Khmer text
          href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Figtree:wght@400..700&family=Kantumruy+Pro:wght@400..700&display=swap',
        },
      ],
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
