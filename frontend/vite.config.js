import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      // Proxy requests starting with '/api' to your backend
      '/api': {
        target: 'http://localhost:5000', // The URL of your backend API server
        changeOrigin: true, // Needed for virtual hosted sites
      },
    },
  }
})
