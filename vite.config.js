import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or your framework plugin

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    headers: {
      'Content-Type': 'application/javascript'
    }
  }
})