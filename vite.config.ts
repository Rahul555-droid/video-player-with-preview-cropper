/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'


// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  server: {
    port: 3000,
    host: 'localhost',
  },
  plugins: [react(), tsconfigPaths() ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['**/*.test.{ts,tsx,jsx,js}'],
    exclude: ['node_modules', 'dist'],
  }
})
