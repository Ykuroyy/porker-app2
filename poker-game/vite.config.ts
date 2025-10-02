import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.e2b.dev',
      '5173-iiuygcsx41vbox0fxkr2s-6532622b.e2b.dev'
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  }
})