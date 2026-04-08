import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'SimploraWebGL',
      fileName: (format) => `simplora-webgl.${format}.js`,
      formats: ['umd', 'es']
    },
    rollupOptions: {
      output: {
        globals: {
        }
      }
    },
    minify: 'terser',
    sourcemap: true
  }
});