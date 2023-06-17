import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    scss: {
      includePaths: ['public/assets/sass/']
    }
  }),

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true
    }),
    alias: {
      // $assets: './src/assets',
      // '$assets/*': './src/assets/*',

      $services: './src/services',
      '$services/*': './src/services/*',

      $components: './src/components',
      '$components/*': './src/components/*',

      $models: './src/models',
      '$models/*': './src/models/*'
    }
  },
}

export default config


