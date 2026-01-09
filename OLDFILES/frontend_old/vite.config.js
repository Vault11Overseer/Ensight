// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  // base: mode === "production" ? "/ensight/" : "/",
  base: mode === "production" ? "./" : "/",
  plugins: [react()],
  build: {
    outDir: "dist", // default, make sure this is present
    emptyOutDir: true, // cleans previous builds
    rollupOptions: {
      output: {
        // ensures chunk filenames go into assets/
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
}));
