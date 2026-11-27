import {readFile} from 'node:fs/promises';
import {basename} from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
export default defineConfig({base:'/WebMinhDuc/',optimizeDeps:{entries:['src/main.tsx']},plugins:[{
  name:'pages-source-template',
  transformIndexHtml:{order:'pre',handler:(html,context)=>basename(context.filename)==='index.html' ? readFile(new URL('./src/index-template.html',import.meta.url),'utf8') : html}
},react({jsxImportSource:'@i18n'})],build:{manifest:true},resolve:{alias:{'@i18n':fileURLToPath(new URL('./src/i18n-runtime', import.meta.url))}}});
