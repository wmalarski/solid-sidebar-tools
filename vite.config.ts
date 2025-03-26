import Sonda from "sonda/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import zipPack from "vite-plugin-zip-pack";
import tsconfigPaths from "vite-tsconfig-paths";
import { manifestPlugin } from "./src/build/manifest-plugin";

export default defineConfig({
  build: {
    rollupOptions: {
      input: ["index.html", "popup.html"],
    },
    sourcemap: true,
    target: "esnext",
  },
  plugins: [
    tsconfigPaths(),
    solidPlugin(),
    Sonda({ enabled: true, open: false }),
    manifestPlugin(),
    zipPack({ outFileName: "solid-sidebar-tools.zip" }),
  ],
  server: {
    port: 3000,
  },
});
