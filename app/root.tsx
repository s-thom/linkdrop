import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
  useMatches,
} from "@remix-run/react";
import type {
  CatchBoundaryComponent,
  ErrorBoundaryComponent,
} from "@remix-run/react/routeModules";
import { useEffect, useRef } from "react";
import { BigErrorPage } from "./components/BigErrorPage";
import { getUser } from "./session.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";
export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "manifest", href: "/resources/manifest.json" },
    { rel: "author", type: "text/plain", href: "/humans.txt" },
    {
      rel: "icon",
      type: "image/png",
      href: "/images/icons/icon-512x512.png",
      sizes: "512x512",
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/images/icons/icon-192x192.png",
      sizes: "192x192",
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/images/icons/icon-128x128.png",
      sizes: "128x128",
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/images/icons/icon-96x96.png",
      sizes: "96x96",
    },
    {
      rel: "apple-touch-icon-precomposed",
      type: "image/png",
      href: "/images/icons/icon-152x152.png",
      sizes: "152x152",
    },
    {
      rel: "apple-touch-icon-precomposed",
      type: "image/png",
      href: "/images/icons/icon-144x144.png",
      sizes: "144x144",
    },
    {
      rel: "apple-touch-icon-precomposed",
      type: "image/png",
      href: "/images/icons/icon-72x72.png",
      sizes: "72x72",
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "linkdrop",
  description:
    "An application to drop interesting links from around the internet.",
  viewport: "width=device-width,initial-scale=1",
  "application-name": "linkdrop",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

export default function App() {
  const location = useLocation();
  const matches = useMatches();

  const mountedRef = useRef(false);
  useEffect(() => {
    // Whether this effect is running on first mount
    const isMount = !mountedRef.current;
    mountedRef.current = true;
    if ("serviceWorker" in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: "REMIX_NAVIGATION",
          isMount,
          location,
          matches,
          manifest: window.__remixManifest,
        });
      } else {
        let listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: "REMIX_NAVIGATION",
            isMount,
            location,
            matches,
            manifest: window.__remixManifest,
          });
        };
        navigator.serviceWorker.addEventListener("controllerchange", listener);
        return () => {
          navigator.serviceWorker.removeEventListener(
            "controllerchange",
            listener
          );
        };
      }
    }
  }, [location, matches]);

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-neutral-50">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = () => {
  return <BigErrorPage status={500} />;
};

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();

  return <BigErrorPage status={caught.status} />;
};
