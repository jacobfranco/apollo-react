/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import path from "node:path";

import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, Plugin, UserConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import { createHtmlPlugin } from "vite-plugin-html";
import compileTime from "vite-plugin-compile-time";
import { VitePWA } from "vite-plugin-pwa";

const { NODE_ENV } = process.env;
const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
export default defineConfig(() => {
  const config: UserConfig = {
    build: {
      assetsDir: "packs",
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: "packs/assets/[name]-[hash].[ext]",
          chunkFileNames: "packs/js/[name]-[hash].js",
          entryFileNames: "packs/[name]-[hash].js",
        },
      },
      sourcemap: true,
    },
    assetsInclude: ["**/*.oga"],
    server: {
      host: "0.0.0.0",
      port: 5173,
      watch: {
        usePolling: false,
      },
    },
    plugins: [
      checker({ typescript: true }),
      compileTime(),
      createHtmlPlugin({
        template: "index.html",
        minify: {
          collapseWhitespace: true,
          removeComments: false,
        },
        inject: {
          data: {
            csp: buildCSP(NODE_ENV),
          },
        },
      }),
      react(),
      VitePWA({
        injectRegister: null,
        strategies: "injectManifest",
        injectManifest: {
          injectionPoint: undefined,
          plugins: [
            // @ts-ignore
            compileTime(),
          ],
        },
        manifest: {
          name: "Apollo",
          short_name: "Apollo",
          description: "The Gaming Frontier",
          theme_color: "#A981FC",
        },
        srcDir: "src/service-worker",
        filename: "sw.ts",
      }),
      visualizer({
        emitFile: true,
        filename: "report.html",
        title: "Apollo Bundle",
      }) as Plugin,
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        src: path.resolve(__dirname, "./src"),
      },
    },
  };

  return config;
});

function buildCSP(env: string | undefined): string {
  const csp = [
    "default-src 'none'",
    "script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "frame-src 'self' https:",
    "font-src 'self'",
    "base-uri 'self'",
    "manifest-src 'self'",
  ];

  if (env === "development") {
    csp.push(
      `connect-src 'self' blob: https: wss: ws: ${backendUrl}`,
      "img-src 'self' data: blob: https: http://*",
      "media-src 'self' https: http://*"
    );
  } else {
    csp.push(
      `connect-src 'self' blob: https: wss: ${backendUrl}`,
      "img-src 'self' data: blob: https:",
      "media-src 'self' https:"
    );
  }

  return csp.join("; ");
}
