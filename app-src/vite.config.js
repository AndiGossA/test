import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The built app is committed to ../app and served by GitHub Pages at
// https://andigossa.github.io/test/app/, so asset URLs need that base.
// Source stays in app-src/ so Pages never serves an unbuilt index.html.
export default defineConfig({
  plugins: [react()],
  base: '/test/app/',
  build: {
    outDir: '../app',
    emptyOutDir: true,
  },
});
