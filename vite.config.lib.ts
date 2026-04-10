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
export default defineConfig(({ mode }) => {
  const isPagesBuild = mode === 'production'

  return {
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
    build: isPagesBuild ? {
      sourcemap: false,
      target: 'chrome91',
      outDir: 'dist',
      rollupOptions: {
        input: {
          index: resolve(PACKAGE_ROOT, 'src/pages/index.html'),
          lecture: resolve(PACKAGE_ROOT, 'src/pages/lecture.html'),
          'lecture-1': resolve(PACKAGE_ROOT, 'src/pages/lecture-1.html'),
          'lecture-2': resolve(PACKAGE_ROOT, 'src/pages/lecture-2.html'),
        },
        output: {
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
      emptyOutDir: true,
    } : {
      sourcemap: false,
      target: 'chrome91',
      outDir: 'dist/js',
      lib: {
        entry: './src/module/index.ts',
        formats: ['es'],
      },
      rollupOptions: {
        output: {
          entryFileNames: 'lib.js',
          assetFileNames: '[name].[ext]',
        },
      },
      emptyOutDir: true,
    },
  }
})

