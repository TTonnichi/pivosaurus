import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/pivosaurus/', // должно совпадать с именем репозитория
  server: {
    port: 3000,
    host: true
  }
})