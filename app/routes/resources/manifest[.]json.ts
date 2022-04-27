import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export let loader: LoaderFunction = () => {
  return json(
    {
      name: "linkdrop",
      id: "kiwi.sthom.linkdrop",
      short_name: "linkdrop",
      theme_color: "#fafafa",
      background_color: "#fafafa",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/",
      shortcuts: [
        {
          name: "Your links",
          description: "View your saved links",
          url: "/links",
          icons: [
            {
              src: "/images/icons/icon-96x96.png",
              sizes: "96x96",
              type: "image/png",
            },
          ],
        },
        {
          name: "New link",
          short_name: "New",
          description: "Save a new link",
          url: "/links/new",
          icons: [
            {
              src: "/images/icons/shortcut-new-96x96.png",
              sizes: "96x96",
              type: "image/png",
            },
          ],
        },
      ],
      icons: [
        {
          src: "/images/icons/icon-72x72.png",
          sizes: "72x72",
          type: "image/png",
        },
        {
          src: "/images/icons/icon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "/images/icons/icon-128x128.png",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "/images/icons/icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "/images/icons/icon-152x152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "/images/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/images/icons/icon-384x384.png",
          sizes: "384x384",
          type: "image/png",
        },
        {
          src: "/images/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      share_target: {
        action: "/links/new",
        method: "GET",
        params: {
          title: "title",
          text: "description",
          url: "url",
        },
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    }
  );
};
