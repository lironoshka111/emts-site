import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Project Pages serve from /<repo>/, so assets need that prefix.
// Set BASE=/ (or drop it) when moving to a custom domain.
export default defineConfig({
  base: process.env.BASE ?? '/emts-site/',
  plugins: [react(), tailwindcss()],
})
