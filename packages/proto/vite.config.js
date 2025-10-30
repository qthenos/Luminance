import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        schedule: resolve(__dirname, 'schedule.html'),
        constructors: resolve(__dirname, 'constructors.html'),
        drivers: resolve(__dirname, 'drivers.html'),
        favorites: resolve(__dirname, 'favorites.html')
      },
    },
  },
})