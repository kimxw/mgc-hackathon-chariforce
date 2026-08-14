import { defineConfig } from 'vite'
import { resolve } from 'node:path'

const dirname = import.meta.dirname

// Static multi-page site — no framework plugin needed. Two real entry
// points now (index.html, story.html); Vite's dev server serves any .html
// file automatically, but `vite build` only bundles what's reachable from
// build.rollupOptions.input, so story.html has to be listed explicitly or
// it silently vanishes from `dist/` on every production build.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(dirname, 'index.html'),
        story: resolve(dirname, 'story.html'),
      },
    },
  },
})
