import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this app from a subdirectory:
  // https://<user>.github.io/<repo>/ — so all emitted asset URLs
  // need to be prefixed with /<repo>/. Override with VITE_BASE_PATH if needed.
  base: process.env.VITE_BASE_PATH ?? '/app.tarefas/',
  server: {
    port: 5173,
  },
})
