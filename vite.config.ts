/// <reference types="vitest" />
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import { env as processEnv } from 'process';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import checker from 'vite-plugin-checker';
import compileTime from 'vite-plugin-compile-time';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import vitePluginRequire from 'vite-plugin-require';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ command, mode }) => {
  // Load environment variables based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    build: {
      assetsDir: 'packs',
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: 'packs/assets/[name]-[hash].[ext]',
          chunkFileNames: 'packs/js/[name]-[hash].js',
          entryFileNames: 'packs/[name]-[hash].js',
        },
      },
      sourcemap: true,
    },
    assetsInclude: ['**/*.oga'],
    server: {
      port: 3036,
    },
    plugins: [
      checker({ typescript: true }),
      // @ts-ignore
      vitePluginRequire.default(),
      compileTime(),
      createHtmlPlugin({
        template: 'index.html',
        minify: {
          collapseWhitespace: true,
          removeComments: false,
        },
      }),
      react({
        include: '**/*.{jsx,tsx}',
        babel: {
          configFile: './babel.config.cjs',
        },
      }),
      VitePWA({
        injectRegister: null,
        strategies: 'injectManifest',
        injectManifest: {
          injectionPoint: undefined,
          plugins: [
            // @ts-ignore
            compileTime(),
          ],
        },
        manifestFilename: 'manifest.json',
        manifest: {
          name: 'Apollo',
          short_name: 'Apollo',
          description: 'The Gaming Frontier',
        },
        srcDir: 'src/service-worker',
        filename: 'sw.ts',
      }),
      viteStaticCopy({
        targets: [{
          src: './node_modules/twemoji/assets/svg/*',
          dest: 'packs/emoji/',
        }],
      }),
      visualizer({
        emitFile: true,
        filename: 'report.html',
        title: 'Apollo Bundle',
      }),
      {
        name: 'mock-api',
        configureServer(server: { middlewares: { use: (arg0: (req: any, res: any, next: any) => void) => void; }; }) {
          server.middlewares.use((req: { url: string; }, res: { statusCode: number; end: (arg0: string) => void; }, next: () => void) => {
            if (/^\/api\//.test(req.url!)) {
              res.statusCode = 404;
              res.end('Not Found');
            } else {
              next();
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        'src': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: 'src/jest/test-setup.ts',
    },
    define: {
      VITE_BACKEND_URL: JSON.stringify(env.VITE_BACKEND_URL),
    },
  };
});


/* 
// Return file as string, or return empty string if the file isn't found. 
function readFileContents(path: string) {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}
*/
