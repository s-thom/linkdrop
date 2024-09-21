import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useMatches,
  useRouteError,
} from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import { useEffect, useRef } from "react";
import stylesheet from "~/styles/custom.css?url";
import { BigErrorPage } from "./components/BigErrorPage";
import { InstallContextProvider } from "./components/InstallContext";
import { getUser } from "./session.server";
import { useInstallPrompt } from "./util/useInstallPrompt";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheet },
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

export const meta: MetaFunction = () => [
  { title: "linkdrop" },
  {
    name: "description",
    content:
      "An application to drop interesting links from around the internet.",
  },
];

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

  useInstallPrompt();

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
            listener,
          );
        };
      }
    }
  }, [location, matches]);

  return (
    <html lang="en" className="h-full">
      <head>
        {" "}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="application-name" content="linkdrop" />
        <Meta />
        <Links />
        <script
          async
          defer
          data-auto-track="true"
          data-domains="linkdrop.sthom.kiwi"
          data-website-id="3301ea45-665c-4140-9a64-ac5a9eae2112"
          src="https://stats.sthom.kiwi/script.js"
        ></script>
      </head>
      <body className="h-full bg-bg text-text">
        <script src="/themes.js"></script>
        <InstallContextProvider>
          <Outlet />
        </InstallContextProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = () => {
  const error = useRouteError();

  let status = 500;
  if (isRouteErrorResponse(error)) {
    status = error.status;
  }

  return <BigErrorPage status={status} />;
};
