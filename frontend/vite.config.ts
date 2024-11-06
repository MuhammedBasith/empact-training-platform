// import path from "path"
import { resolve } from 'path';
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr";
 
export default defineConfig({
  plugins: [svgr(), react()],
  define: {
    global: {},
},
resolve: {
  alias: {
      src: resolve(__dirname, 'src'),
  },
},
});