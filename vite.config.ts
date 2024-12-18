import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';
import path from "path"

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve('./cert/server.key')),
      cert: fs.readFileSync(path.resolve('./cert/server.crt'))
    },
    host: '0.0.0.0',
    port: 3000
  }
});
