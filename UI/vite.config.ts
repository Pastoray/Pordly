import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import { readFileSync } from 'fs'
// import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  /*server: {
    https: {
      key: readFileSync(resolve(__dirname, '\server.key')),
      cert: readFileSync(resolve(__dirname, '\server.cert')),
    },
  },*/
})
