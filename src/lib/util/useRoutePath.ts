import { useMemo } from "react";

/**
 * Returns the current pathname, replacing dynamic segments with their names.
 * In this app, that includes link IDs and search parameters (PII).
 */
export function useRoutePath() {
  return useMemo(() => {
    if (typeof window === "undefined") return "/";
    return window.location.pathname;
  }, []);
}
