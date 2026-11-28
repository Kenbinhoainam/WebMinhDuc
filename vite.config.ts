import {readFile} from 'node:fs/promises';
import {basename} from 'node:path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {adaptHostingPaths, base} from './scripts/hosting-profile.mjs';

export default defineConfig({
  base: base + '/',
  optimizeDeps: {entries: ['src/main.tsx']},
  plugins: [{
    name: 'hosting-paths',
    enforce: 'pre',
    transform(code, id) {
      if (base || !id.startsWith(process.cwd() + '/src/') || !code.includes('/WebMinhDuc')) return null;
      return adaptHostingPaths(code);
    },
    transformIndexHtml: {order: 'pre', async handler(html, context) {
      if (basename(context.filename) !== 'index.html') return html;
      return adaptHostingPaths(await readFile(new URL('./src/index-template.html', import.meta.url), 'utf8'));
    }},
  }, react({jsxImportSource: '@i18n'})],
  build: {manifest: true},
  resolve: {alias: {'@i18n': fileURLToPath(new URL('./src/i18n-runtime', import.meta.url))}},
});
