import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import eslintPlugin from 'vite-plugin-eslint'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify']
  },
  modules: [
    // '@nuxtjs/eslint-module',
    '@nuxt/content',
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
    // ...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    },
    plugins: [eslintPlugin()]
  },
  typescript: {
    strict: true
  },
  plugins: [{ src: '~/plugins/vue3-grid-layout-next', mode: 'client' }],
  runtimeConfig: {
    redis: {
      // Default values
      host: '',
      port: 0
      /* other redis connector options */
    }
  }
})
