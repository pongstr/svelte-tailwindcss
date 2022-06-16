/* eslint-disable @typescript-eslint/no-var-requires */
const sveltePreprocess = require('svelte-preprocess')
const config = {
  preprocess: sveltePreprocess({
    postcss: {
      plugins: [
        require('postcss-nested')(),
        require('tailwindcss')(),
        require('autoprefixer')(),
      ],
    },
  }),
}

module.exports = config
