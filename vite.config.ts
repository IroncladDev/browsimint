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
      browser: "brave",
      manifest: generateManifest,
      disableAutoLaunch: true,
      additionalInputs: [
        "src/providers/index.ts",
        "src/content-script.ts",
        "src/background/index.ts",
        "src/prompt.html",
        "src/popup.html",
      ],
    }),
  ],

  build: {
    target: "esnext",
  },

  worker: {
    format: "es",
    plugins: () => [wasm(), topLevelAwait()],
  },

  optimizeDeps: {
    exclude: ["@fedimint/core-web"],
  },
});
