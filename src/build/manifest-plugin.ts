import type { UserConfig } from "vite";

export const manifestPlugin = (): NonNullable<UserConfig["plugins"]>[0] => {
  return {
    generateBundle(_options) {
      const manifest = {
        action: {
          default_popup: "popup.html",
          default_title: "Click to open panel",
        },
        description: "",
        host_permissions: ["https://*/*", "http://*/*"],
        icons: {
          "16": "images/16x16.png",
          "32": "images/32x32.png",
          "48": "images/48x48.png",
          "128": "images/128x128.png",
        },
        manifest_version: 3,
        name: "Solid Sidebar Tools",
        permissions: ["sidePanel", "cookies", "activeTab", "storage"],
        side_panel: {
          default_path: "index.html",
        },
        version: "1.0",
      };

      this.emitFile({
        fileName: "manifest.json",
        source: JSON.stringify(manifest, null, 2),
        type: "asset",
      });
    },
    name: "chrome-extension-manifest-plugin",
  };
};
