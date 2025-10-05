import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/gee-proxy': {
        target: 'https://earthengine.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gee-proxy/, '')
      }
    }
  }
})