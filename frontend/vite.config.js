import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },

  preview: {
    allowedHosts: ["autumn-festival-app.onrender.com"],
    proxy: {
      "/api": {
        target: process.env.BACKEND_URL,
        changeOrigin: true,
        secure: true,
      },
    },
  },
});