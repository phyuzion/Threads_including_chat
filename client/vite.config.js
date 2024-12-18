import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    inject({
      process: 'process/browser', // process를 브라우저에서 사용할 수 있도록 polyfill
    }),],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  resolve: {
    alias: {
      'buffer': 'buffer/',
      util: 'util/', // util 모듈도 브라우저에서 사용할 수 있도록 설정
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
