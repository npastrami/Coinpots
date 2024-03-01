import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080', 
        changeOrigin: true, //changeOrigin: *true helps in circumventing CORS-related issues by modifying the Origin header to match the target URL
        secure: false, //secure: *false {change for prod} allows the proxy to work with servers that have self-signed or otherwise untrusted SSL certificates
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});