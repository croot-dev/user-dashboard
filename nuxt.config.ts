import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      }
    },
  },
  plugins: [
    {src: '~/plugins/vue3-grid-layout-next', mode: 'client'},
  ],
  runtimeConfig: {
    redis: { // Default values
      host: '',
      port: 0,
      /* other redis connector options */
    }
  },
})
