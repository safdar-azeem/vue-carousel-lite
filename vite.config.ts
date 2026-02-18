import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      insertTypesEntry: true,
      exclude: ['src/App.vue', 'src/main.ts', 'src/examples.ts', 'src/vite-env.d.ts'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueCarouselLite',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      // Externalize deps that should not be bundled
      external: ['vue'],
      output: {
        preserveModules: false,
        exports: 'named',
        assetFileNames: 'style.[ext]',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
