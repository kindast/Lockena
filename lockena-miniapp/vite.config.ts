import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";
import path from "path";

export default defineConfig({
  base: "/miniapp/",
  plugins: [react(), tailwindcss(), mkcert()],
  resolve: {
    alias: {
      "lockena-core": path.resolve(__dirname, "../lockena-core/src/index.ts"),
    },
  },
});
