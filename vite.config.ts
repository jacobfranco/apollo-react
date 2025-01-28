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

const { NODE_ENV, BACKEND_URL, STREAMING_URL } = process.env;

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
    // Updated script-src to include all needed Google domains
    "script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline' https://*.google.com https://*.googlesyndication.com https://*.googletagmanager.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.doubleclick.net https://*.googleadservices.com https://*.adtrafficquality.google https://ep2.adtrafficquality.google",
    "style-src 'self' 'unsafe-inline'",
    // Updated frame-src to include doubleclick
    "frame-src 'self' https: https://*.doubleclick.net https://*.google.com",
    "font-src 'self'",
    "base-uri 'self'",
    "manifest-src 'self'",
    // Added object-src restriction
    "object-src 'none'",
    // Added worker-src for service workers
    "worker-src 'self' blob:",
    // Added form-action
    "form-action 'self'",
    // Added frame-ancestors
    "frame-ancestors 'none'",
    // Added child-src
    "child-src 'self' blob: https://*.google.com https://*.doubleclick.net",
  ];

  if (env === "development") {
    csp.push(
      // Updated connect-src to include Google services
      `connect-src 'self' blob: https: wss: ws: ${BACKEND_URL} ${STREAMING_URL} https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`,
      // Updated img-src to include Google services
      "img-src 'self' data: blob: https: http://* https://*.google-analytics.com https://*.googletagmanager.com https://*.doubleclick.net",
      "media-src 'self' https: http://*"
    );
  } else {
    csp.push(
      // Updated connect-src for production
      `connect-src 'self' blob: https: wss: ${BACKEND_URL} ${STREAMING_URL} https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`,
      // Updated img-src for production
      "img-src 'self' data: blob: https: http://* *.imgix.net https://*.google-analytics.com https://*.googletagmanager.com https://*.doubleclick.net",
      "media-src 'self' https:"
    );
  }

  return csp.join("; ");
}
