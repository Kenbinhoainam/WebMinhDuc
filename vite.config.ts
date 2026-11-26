import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const appTemplate = new URL('./src/index-template.html', import.meta.url);

export default defineConfig({
  plugins: [
    {
      name: 'source-html-template',
      // The root index.html serves the prebuilt copy on GitHub Pages.
      transformIndexHtml: {
        order: 'pre',
        handler: (html, context) => basename(context.filename) === 'index.html' ? readFile(appTemplate, 'utf8') : html,
      },
    },
    react({ jsxImportSource: '@i18n' }),
  ],
  build: { manifest: true },
  optimizeDeps: { entries: ['src/main.tsx'] },
  resolve: {
    alias: {
      '@i18n': fileURLToPath(new URL('./src/i18n-runtime', import.meta.url)),
    },
  },
});
