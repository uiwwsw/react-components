import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      $: fileURLToPath(new URL('./src/assets', import.meta.url)),
      '#': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@': fileURLToPath(new URL('./src/components', import.meta.url)),
      '!': fileURLToPath(new URL('./src/libs', import.meta.url)),
      src: fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/',
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: API,
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
});
