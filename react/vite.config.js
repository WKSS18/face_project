import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 配置代理关键字：以 /api 开头的请求
      '/api': {
        target: 'https://jsonplaceholder.typicode.com', // 目标服务器
        changeOrigin: true, // 关键：修改请求头中的 Origin 字段，欺骗服务器
        rewrite: (path) => path.replace(/^\/api/, ''), // 去掉 /api 前缀
      },
    },
  },
})
