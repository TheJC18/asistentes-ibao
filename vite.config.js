import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import flowbiteReact from "flowbite-react/plugin/vite";
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    flowbiteReact(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Asistentes IABO',
        short_name: 'Asistentes IABO',
        description: 'App de Asistentes IABO',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait',
        lang: 'es',
        icons: [
          {
            src: '/logo.webp',
            sizes: '48x48',
            type: 'image/svg+xml',
          },
          {
            src: '/logo.webp',
            sizes: '72x72',
            type: 'image/svg+xml',
          },
          {
            src: '/logo.webp',
            sizes: '96x96',
            type: 'image/svg+xml',
          },
          {
            src: '/logo.webp',
            sizes: '144x144',
            type: 'image/svg+xml',
          },
          {
            src: '/logo.webp',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/logo.webp',
            sizes: '256x256',
            type: 'image/svg+xml',
          },
          {
            src: '/logo.webp',
            sizes: '384x384',
            type: 'image/svg+xml',
          },
          {
            src: '/logo.webp',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
    }),
  ],
})