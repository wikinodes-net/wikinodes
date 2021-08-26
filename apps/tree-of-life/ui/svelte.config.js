import preprocess from 'svelte-preprocess'
/** @type {import('@sveltejs/kit').Config} */
// import adapter from '@sveltejs/adapter-static'

const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    // adapter: adapter(),

    // hydrate the <div id="xxx"> element in src/app.html
    target: '#space_view3',
  },
}

export default config
