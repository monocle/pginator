import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    proxy: {
      "/api/v1": {
        target: "http://backend:5000/",
        changeOrigin: false,
      },
    },
  },
});
