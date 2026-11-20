import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Backend al que el servidor de desarrollo redirige /api. Por defecto el local; se puede
// apuntar a otro (p. ej. el NUC por Tailscale) con API_PROXY_TARGET sin tocar esta config.
const apiTarget = process.env.API_PROXY_TARGET || 'http://127.0.0.1:8080'

// Salida estática: el panel no necesita servidor propio. En el NUC lo servirá nginx, que
// además redirigirá /api al backend (misma forma que este proxy de desarrollo).
export default defineConfig({
  output: 'static',
  integrations: [react()],
  server: { port: 4321, host: '0.0.0.0' },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@services': path.resolve(__dirname, './src/services'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@types': path.resolve(__dirname, './src/types'),
        '@constants': path.resolve(__dirname, './src/constants'),
      },
    },
    server: {
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true, secure: false },
      },
    },
  },
})
