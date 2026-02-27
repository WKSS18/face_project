import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
     // 自动生成类型声明文件，并保持目录结构
     dts({
      rollupTypes: true, // Vite 5+ 推荐配置，合并类型声明文件
    }),
  ],
  server: {
    port: 5174,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: (asset) => {
          const name = asset.name || ''
          return name.endsWith('.css') ? '[name][extname]' : 'assets/[name]-[hash][extname]'
        },
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,
  },
})
