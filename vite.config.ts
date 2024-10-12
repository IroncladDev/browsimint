import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");

  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    webExtension({
      manifest: generateManifest,
      disableAutoLaunch: true,
      additionalInputs: [
        "src/providers/index.ts",
        "src/scripts/content-script.ts",
        "src/scripts/background.ts",
        "src/prompt.html",
      ],
    }),
  ],

  worker: {
    format: "es",
    plugins: () => [wasm(), topLevelAwait()],
  },
});
