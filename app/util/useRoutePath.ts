import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

/**
 * Remix's useLocation gives the full path as it appears in the browser.
 * However, in some cases information that doesn't need to be logged appears in the URL.
 * In the case of this app, that includes link IDs and any parameters when creating links or searching
 * (as this is PII).
 * @returns Path with any parameters replaced with their names
 */
export function useRoutePath() {
  const matches = useMatches();

  return useMemo(() => {
    const finalMatch = matches[matches.length - 1];

    const replacements = new Map(
      Object.entries(finalMatch.params).map(([k, v]) => [v, k]),
    );
    const parts = finalMatch.pathname.split("/");

    const replaced = parts.map((part) =>
      replacements.has(part) ? `[${replacements.get(part)}]` : part,
    );
    return replaced.join("/");
  }, [matches]);
}
