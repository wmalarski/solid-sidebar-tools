import { defineConfig } from "@pandacss/dev";
import { createPreset } from "@park-ui/panda-preset";
import amber from "@park-ui/panda-preset/colors/amber";
import sand from "@park-ui/panda-preset/colors/sand";

export default defineConfig({
  conditions: {
    extend: {
      dark: '.dark &, [data-theme="dark"] &',
      light: ".light &",
    },
  },
  include: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  jsxFramework: "solid",
  outdir: "styled-system",
  preflight: true,
  presets: [
    createPreset({
      accentColor: amber,
      grayColor: sand,
      radius: "sm",
    }),
  ],
});
