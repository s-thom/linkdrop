import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";

hydrate(<RemixBrowser />, document);

if ("serviceWorker" in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/entry.worker.js")
      .then(() => navigator.serviceWorker.ready)
      .catch((error) => {
        console.error("Service worker registration failed", error);
      });
  });
}
