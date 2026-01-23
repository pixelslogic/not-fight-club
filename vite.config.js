import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import autoprefixer from 'autoprefixer';
import fs from 'fs';

const htmlFiles = fs.readdirSync(resolve(process.cwd(), 'source'))
  .filter(file => file.endsWith('.html'))
  .reduce((entries, file) => {
    const name = file.replace(/\.html$/, '');
    entries[name] = resolve(process.cwd(), 'source', file);
    return entries;
  }, {});

export default defineConfig({
  root: 'source',
  base: './',
  build: {
    outDir: '../build',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: htmlFiles,
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
          src: 'assets/icon/sprite.svg',
          dest: 'assets/icon'
        }
      ]
    })
  ]
});