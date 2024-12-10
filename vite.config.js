import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // Add MIME type configuration
    middlewares: [
      (req, res, next) => {
        if (req.url.endsWith('.webmanifest')) {
          res.setHeader('Content-Type', 'application/manifest+json')
        }
        next()
      }
    ]
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})