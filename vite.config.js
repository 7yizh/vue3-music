// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vue3-music/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'docs'
  },
  server: {
    port: process.env.VITE_PORT || 5173,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_APP_BASE_API,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  define: {
    'process.env': {}  // 兼容一些仍使用 process.env 的库
  },
  esbuild: {
    drop: ['console', 'debugger'], //去除console
  },
})