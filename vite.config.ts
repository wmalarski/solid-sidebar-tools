import Sonda from "sonda/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    solidPlugin(),
    Sonda({ enabled: false }),
    {
      name: "postbuild-commands",
      generateBundle(_options, bundle) {
        const worker = Object.values(bundle).find(
          (asset) => asset.name === "service-worker",
        );
        if (!worker) {
          return;
        }

        console.log({ worker: worker.fileName });

        this.emitFile({
          type: "asset",
          fileName: "manifest2.json",
          source: JSON.stringify({
            background: {
              service_worker: worker.fileName,
            },
          }),
        });
      },
      // closeBundle: () => {
      //   console.log("args");
      //   const path = './dist/manifest.json';
      //   // const manifest = JSON.parse(fs.readFileSync(path).toString());
      //   // manifest['index.html'].customProp = true;
      //   // fs.writeFileSync(path, JSON.stringify(manifest, null, 2));
      // },
    },
  ],
  server: {
    port: 3000,
  },
  build: {
    sourcemap: true,
    target: "esnext",
    rollupOptions: {
      input: ["index.html", "src/service-worker.ts"],
      // plugins: [
      //   replace({
      //     preventAssignment: true,
      //     "src/service-worker.ts": JSON.stringify("production"),
      //     // __buildDate__: () => JSON.stringify(new Date()),
      //     // __buildVersion: 15
      //   }),
      // ],
      // input: {
      //   "index.html": "index.html",
      //   "service-worker.js": "src/service-worker.ts",
      // },
      // output: {},
    },
  },
});
