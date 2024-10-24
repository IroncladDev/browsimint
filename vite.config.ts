import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
import topLevelAwait from "vite-plugin-top-level-await"
import wasm from "vite-plugin-wasm"
import webExtension, { readJsonFile } from "vite-plugin-web-extension"

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json")
  const pkg = readJsonFile("package.json")

  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    webExtension({
      browser: "brave",
      manifest: generateManifest,
      disableAutoLaunch: true,
      additionalInputs: [
        "src/injection/index.ts",
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
})
