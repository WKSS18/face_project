import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // // 本地调试：指向组件库源码，修改 component-library 即可热更新
      '@face-project/ui': path.resolve(__dirname, '../component-library/src'),
      // '@face-project/ui/Button': path.resolve(__dirname, '../component-library/src/Button'),
      // // 组件库样式（避免包解析失败，用单独别名）
      // 'face-project-ui-styles': path.resolve(__dirname, '../component-library/src/Button/Button.css'),
      'face-project-ui-styles': path.resolve(__dirname, '../component-library/dist/ui.css'),
    },
  },
})
