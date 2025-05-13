import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Слушаем все интерфейсы
    port: 5173,
    strictPort: true, // Запрещаем автоматический выбор порта
    hmr: {
      clientPort: 5173, // Важно для HMR в Docker
    },
    // Разрешаем CORS для внешних запросов
    cors: true
  }
})
