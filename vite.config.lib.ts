/**
 * @author hangli2
 * @date 2021/11/19
 * @description 渲染进程
 */

import { resolve } from 'path'
import { defineConfig } from 'vite'
import { loadAndSetEnv } from './scripts/load_set_env.js'

const PACKAGE_ROOT = __dirname

loadAndSetEnv(process.env.MODE, process.cwd())

/**
 * Vite looks for `.env.[mode]` files only in `PACKAGE_ROOT` directory.
 * Therefore, you must manually load and set the environment variables from the root directory above
 */

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  root: PACKAGE_ROOT,
  base: './',
  resolve: {
    alias: {
      'src': resolve(PACKAGE_ROOT, 'src')
    },
  },
  plugins: [
  ],
  server: {
    host: '0.0.0.0',
    port: 3001
  },
  build: {
    sourcemap: false,
    target: `chrome91`,
    outDir: 'dist/js',
    lib: {
      entry: './src/module/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      // input: {
      // styles: './src/static/content.scss',
      // entry:'./src/module/editor.ts',
      // },
      output: {
        entryFileNames: 'lib.js',
        assetFileNames: '[name].[ext]',
      },
    },
    emptyOutDir: true,
  },
})

