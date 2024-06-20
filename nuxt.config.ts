// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt"
  ],
  routeRules: {
    '/room/**': { ssr: false },
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: '.',
      }
    }
  },
  nitro: {
    esbuild: {
      options: {
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true
          }
        }
      }
    }
  }
});