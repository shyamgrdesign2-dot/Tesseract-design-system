/// <reference types="node" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Library build for the publishable `tp-ui` package. Bundles src/index.js into
// dist as ESM + CJS, externalising React (it's a peer dependency, never bundled)
// and emitting a single stylesheet (dist/tp-ui.css).
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': dirname } },
  // Don't copy public/ into the bundle — the icon/brand SVGs (100 MB+) are
  // runtime-hosted assets, not package payload (see README "Static assets").
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false, // one stylesheet for the whole library
    lib: {
      entry: path.join(dirname, 'src/index.js'),
      formats: ['es', 'cjs'],
      fileName: (format) => `tp-ui.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // React (and any react/* · react-dom/* subpath) stays external.
      external: (id) =>
        id === 'react' ||
        id === 'react-dom' ||
        id.startsWith('react/') ||
        id.startsWith('react-dom/'),
      output: {
        assetFileNames: 'tp-ui.[ext]', // → dist/tp-ui.css
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
      // "use client" directives are meaningful to RSC consumers but rollup warns
      // when bundling them; silence that one noisy warning.
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    },
  },
});
