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
      entryRoot: 'src',
      copyDtsFiles: true,
      cleanVueFileName: true,
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
      name: 'vue-carousel-lite',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => {
        const externals = ['vue']
        return externals.some((ext) => id === ext || id.startsWith(ext + '/'))
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        exports: 'named',
        assetFileNames: 'style.[ext]',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
