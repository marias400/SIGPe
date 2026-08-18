import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    // Railway sirve el sitio detrás de un dominio *.up.railway.app; Vite
    // bloquea por defecto cualquier Host header que no reconozca.
    allowedHosts: true,
  },
})
