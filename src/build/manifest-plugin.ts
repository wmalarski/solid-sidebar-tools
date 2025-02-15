import type { UserConfig } from "vite";

export const manifestPlugin = (): NonNullable<UserConfig["plugins"]>[0] => {
  return {
    name: "chrome-extension-manifest-plugin",
    generateBundle(_options, bundle) {
      const workerFilename = Object.values(bundle).find(
        (asset) => asset.name === "service-worker",
      )?.fileName;

      const manifest = {
        manifest_version: 3,
        name: "Solid Sidebar Tools",
        version: "1.0",
        description: "",
        action: {
          default_title: "Click to open panel",
          default_popup: "popup.html",
        },
        background: {
          service_worker: workerFilename,
        },
        side_panel: {
          default_path: "index.html",
        },
        permissions: ["sidePanel", "cookies", "tabs", "storage"],
        host_permissions: ["https://*/*", "http://*/*"],
        icons: {
          "16": "images/16x16.png",
          "32": "images/32x32.png",
          "48": "images/48x48.png",
          "128": "images/128x128.png",
        },
      };

      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: JSON.stringify(manifest, null, 2),
      });
    },
  };
};
