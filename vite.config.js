import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/', // Certifique-se de que esse caminho é adequado para o GitHub Pages
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PWA Vite SQLite',
        short_name: 'PWA Vite',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{html,js,css,png,jpg,jpeg,gif,svg}'],
        swDest: 'service-worker.js',
      },
      devOptions: {
        enabled: true, // Habilita o Service Worker no ambiente de desenvolvimento
        type: 'module', // Usa o tipo de módulo para o Service Worker
      },
    }),
  ],
  esbuild: {
    jsxInject: `import React from 'react'`, // Garante que JSX funcione em arquivos .js
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
