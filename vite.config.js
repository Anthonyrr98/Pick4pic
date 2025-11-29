import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 将 base 设置为你的 GitHub 仓库名，例如：'/pick4pic/'
const repoName = 'Pick4pic'

// https://vite.dev/config/
export default defineConfig({
  base: `/${repoName}/`,
  plugins: [react()],
  // PWA 支持
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
