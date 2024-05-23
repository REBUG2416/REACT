import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    host: "0.0.0.0", // Ensure it listens on all network interfaces
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
