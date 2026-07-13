import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// GitHub Pages serves this app from a subdirectory:
// https://<user>.github.io/<repo>/ — so all emitted asset URLs
// need to be prefixed with /<repo>/. Override with VITE_BASE_PATH if needed.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH ?? '/app.tarefas/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
})
