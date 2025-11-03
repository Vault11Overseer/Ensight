import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/ensight/" : "/",
  plugins: [react()],
  optimizeDeps: {
    exclude: ["fsevents"],
  },
}))
