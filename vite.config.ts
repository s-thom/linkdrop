import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { createRoutesFromFolders } from "@remix-run/v1-route-convention";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    !process.env.VITEST &&
      remix({
        ignoredRouteFiles: [".*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],

        routes(defineRoutes) {
          // uses the v1 convention, works in v1.15+ and v2
          return createRoutesFromFolders(defineRoutes);
        },
      }),
    tsconfigPaths(),
  ],
});
