import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    // Dev-only middleware to 404 the /dashboard route so it is removed during development
    {
      name: 'dev-no-dashboard',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          try {
            const url = req.url || ''
            if (url.startsWith('/dashboard') || url === '/dashboard') {
              res.statusCode = 404
              res.end('Not Found')
              return
            }
          } catch (e) {
            // ignore
          }
          next()
        })
      },
    },
  ],
})
