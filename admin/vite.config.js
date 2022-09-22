import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from "path";

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(() => {
  // const viteEnv = wrapperEnv(env)
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // ...
          },
          transformAssetUrls: {
            // ...
          }
        }
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        // "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: `@import "@/styles/variable.scss";`
        }
      }
    },
  }
})
