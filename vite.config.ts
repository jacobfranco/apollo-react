/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import path from "node:path";

import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { Connect, defineConfig, Plugin, UserConfig } from "vite";
import checker from "vite-plugin-checker";
import { createHtmlPlugin } from "vite-plugin-html";
import compileTime from "vite-plugin-compile-time";
import { VitePWA } from "vite-plugin-pwa";

const { NODE_ENV, VITE_BACKEND_URL, VITE_STREAMING_URL } = process.env;

export default defineConfig(({ mode }) => {
  console.log("Vite running in mode:", mode);
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
      {
        name: "vite-apollo-dev",
        configureServer(server) {
          const notFoundHandler: Connect.SimpleHandleFunction = (_req, res) => {
            res.statusCode = 404;
            res.end();
          };

          server.middlewares.use("/api/", notFoundHandler);
          server.middlewares.use("/oauth/", notFoundHandler);
          server.middlewares.use("/nodeinfo/", notFoundHandler);
          server.middlewares.use("/.well-known/", notFoundHandler);
        },
      },
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
      `connect-src 'self' blob: https: wss: ws: ${VITE_BACKEND_URL} ${VITE_STREAMING_URL}`,
      "img-src 'self' data: blob: https: http://*",
      "media-src 'self' https: http://*"
    );
  } else {
    csp.push(
      `connect-src 'self' blob: https: wss: ${VITE_BACKEND_URL} ${VITE_STREAMING_URL}`,
      "img-src 'self' data: blob: https:",
      "media-src 'self' https:"
    );
  }

  return csp.join("; ");
}
