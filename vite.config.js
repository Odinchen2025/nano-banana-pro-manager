import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ⚠️ 重要：請確認您的 GitHub Repository 名稱是否為 "nano-banana-pro-manager"
  // 如果您的倉庫名稱不同，請修改下方的路徑，前後都要保留斜線
  base: "/nano-banana-pro-manager/",
})
