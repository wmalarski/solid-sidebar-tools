import Sonda from "sonda/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import zipPack from "vite-plugin-zip-pack";
import tsconfigPaths from "vite-tsconfig-paths";
import { manifestPlugin } from "./src/build/manifest-plugin";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    solidPlugin(),
    Sonda({ enabled: false }),
    manifestPlugin(),
    zipPack({ outFileName: "solid-sidebar-tools.zip" }),
  ],
  server: {
    port: 3000,
  },
  build: {
    sourcemap: true,
    target: "esnext",
    rollupOptions: {
      input: ["index.html", "src/service-worker.ts"],
    },
  },
});
