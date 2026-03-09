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
    outDir: 'docs',
    rollupOptions: {
      output: {
        // 自定义 chunk 文件名，避免下划线开头
        chunkFileNames: (chunkInfo) => {
          // 处理 Vue 的导出助手
          if (chunkInfo.name.includes('plugin-vue:export-helper')) {
            return 'assets/vue-export-helper.[hash].js'
          }
          // 处理其他以 _ 开头的文件
          if (chunkInfo.name.startsWith('_')) {
            return `assets/${chunkInfo.name.substring(1)}.[hash].js`
          }
          return 'assets/[name].[hash].js'
        },
        // 入口文件命名
        entryFileNames: 'assets/[name].[hash].js',
        // 静态资源命名
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
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