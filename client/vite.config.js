import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'buffer': 'buffer/',
    },
  },
  server: {
    port: 3000,
    // get rid of the cors error
    // proxy: {
    //   '/media': {
    //     target: 'http://localhost:6060',
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path.replace(/^\/media/, '')
    //   },
    // },
  },
});
