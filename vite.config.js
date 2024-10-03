import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Make sure this matches your platform's publish directory
  },
  server: {
    historyApiFallback: true, // This ensures correct routing for Vite dev server
  }
});
