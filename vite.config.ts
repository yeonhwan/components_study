import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const dev = process.env.NODE_ENV === "development";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: dev,
  },
});
