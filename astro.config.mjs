import { defineConfig, envField } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server",
  site: "https://linkdrop.sthom.kiwi",
  adapter: node({ mode: "standalone" }),
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  security: {
    checkOrigin: process.env.NODE_ENV === "production",
    allowedDomains: [
      {
        hostname: "linkdrop.sthom.kiwi",
        protocol: "https",
      },
    ].concat(
      process.env.NODE_ENV === "production"
        ? []
        : {
            hostname: "localhost",
            protocol: "http",
            port: "4321",
          },
    ),
  },
  env: {
    schema: {
      DATABASE_URL: envField.string({ context: "server", access: "secret" }),
      SESSION_SECRET: envField.string({ context: "server", access: "secret" }),
      TOTP_SECRET: envField.string({ context: "server", access: "secret" }),
      ALLOW_EMAIL_JOIN: envField.boolean({
        context: "server",
        access: "public",
        optional: true,
        default: false,
      }),
      SUPERUSER_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      PRIMARY_REGION: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),
      FLY_REGION: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),
    },
  },
  vite: {
    resolve: {
      alias: {
        "~": "/src",
      },
    },
  },
});
