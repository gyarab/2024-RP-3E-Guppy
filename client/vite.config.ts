import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Detect environment (Docker or Local Dev)
const isDocker = process.env.NODE_ENV === "production";

console.log("isDocker:", isDocker);

export default defineConfig({
  plugins: [react()],
  server: isDocker
    ? {} // In production, Vite's dev server is not used
    : {
        proxy: {
          "/api": {
            target: "http://localhost:5000", // NestJS backend
            changeOrigin: true,
            secure: false,
          },
        },
        host: "0.0.0.0",
        port: 5173,
      },
});
