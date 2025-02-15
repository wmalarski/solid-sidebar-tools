import Sonda from "sonda/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import { manifestPlugin } from "./src/build/manifest-plugin";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    solidPlugin(),
    Sonda({ enabled: true, open: false }),
    manifestPlugin(),
  ],
  server: {
    port: 3000,
  },
  build: {
    sourcemap: true,
    target: "esnext",
    rollupOptions: {
      input: ["index.html", "popup.html", "src/service-worker.ts"],
    },
  },
});
