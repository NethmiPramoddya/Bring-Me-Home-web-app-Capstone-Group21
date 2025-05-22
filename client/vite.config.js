import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // <-- allows access from external devices
    allowedHosts: [
      'e711-2402-4000-2300-38da-edb2-e06a-2b1c-f2f4.ngrok-free.app'
    ]
  }
})
