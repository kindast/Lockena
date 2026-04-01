import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  base: "/miniapp/",
  plugins: [react(), tailwindcss(), mkcert()],
});
