import Sonda from "sonda/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), solidPlugin(), Sonda({ enabled: false })],
  server: {
    port: 3000,
  },
  build: {
    sourcemap: true,
    target: "esnext",
  },
});
