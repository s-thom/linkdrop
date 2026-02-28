/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
  server: {
    watch: {
      ignored: [
        ".*\\/node_modules\\/.*",
        ".*\\/build\\/.*",
        ".*\\/postgres-data\\/.*",
      ],
    },
  },
});
