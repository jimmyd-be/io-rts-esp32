import { defineConfig, loadEnv } from "vite";
import preact from "@preact/preset-vite";
import { readFileSync, writeFileSync, unlinkSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

function gzipPlugin() {
  let outDir = "dist";
  return {
    name: "gzip-assets",
    apply: "build" as const,
    configResolved(config: { build: { outDir: string } }) {
      outDir = config.build.outDir ?? "dist";
    },
    closeBundle() {
      const compress = (dir: string) => {
        for (const name of readdirSync(dir)) {
          const full = join(dir, name);
          if (statSync(full).isDirectory()) compress(full);
          else if (/\.(js|css|json)$/.test(name)) {
            writeFileSync(full + ".gz", gzipSync(readFileSync(full), { level: 9 }));
            unlinkSync(full);
          }
        }
      };
      compress(outDir);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const proxyTarget = env.VITE_PROXY_TARGET;

  return {
    plugins: [preact(), gzipPlugin()],
    envPrefix: "VITE_",
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
        "/ws": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  };
});
