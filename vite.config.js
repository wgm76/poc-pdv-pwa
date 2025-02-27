import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// Vite config
export default defineConfig({
  base: "/",
  plugins: [
    react(), // Garantir que JSX seja compilado
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "PWA Vite SQLite",
        short_name: "PWA Vite",
        start_url: "/poc-pdv-pwa/",  // Corretamente refletindo a estrutura de base
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/poc-pdv-pwa/icons/icon-192x192.png",  // Caminho ajustado
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/poc-pdv-pwa/icons/icon-512x512.png",  // Caminho ajustado
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "index.html",  // Confirma que o Vite usa o index.html corretamente
      output: {
        entryFileNames: "assets/index.js",  // Remover o hash no nome do arquivo
        chunkFileNames: "assets/[name].js",  // Outros arquivos JS também não terão hash
        assetFileNames: "assets/[name].[ext]",  // Não adicionar hash a outros arquivos
      },
    },
  },
});
