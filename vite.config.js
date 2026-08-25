import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages phục vụ site tại /FocusPomo/ nên bản build cần base đó,
// còn `npm run dev` vẫn chạy ở / cho tiện.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/FocusPomo/' : '/',
  plugins: [react()],
  server: { port: 5173, open: true },
}))
