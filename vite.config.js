import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  root: 'source',
  base: './',
  build: {
    outDir: '../build',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'source/index.html'),
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },

  css: {
    postcss: {
      plugins: [autoprefixer()]
    }
  },

  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'source/assets/img/icon/sprite.svg',
          dest: 'assets/img/icon'
        }
      ]
    })
  ]
});
