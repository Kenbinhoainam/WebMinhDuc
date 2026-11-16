import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
export default defineConfig({plugins:[react({jsxImportSource:'@i18n'})],resolve:{alias:{'@i18n':fileURLToPath(new URL('./src/i18n-runtime', import.meta.url))}}});
