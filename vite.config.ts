import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
import compileTime from 'vite-plugin-compile-time';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compileTime()],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
    },
  },
})
