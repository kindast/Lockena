import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(), basicSsl()],
  resolve: {
    alias: {
      "lockena-core": path.resolve(__dirname, "../lockena-core/src/index.ts"),
    },
  },
});
