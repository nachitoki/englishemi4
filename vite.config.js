import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // usar rutas relativas hace que funcione bajo /englishemi4/ y también si cambias el nombre del repo
  base: './',
  plugins: [react()],
})
