import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: '/',
  // inspectAttr stamps every element with a code-path="src/..." debug
  // attribute - great in dev, but in production it was 640 attributes
  // = 40KB of every prerendered page (27% of the home HTML) plus dead
  // strings in the bundle (perf audit 7/17). Dev server only now.
  plugins: [...(command === 'serve' ? [inspectAttr()] : []), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
