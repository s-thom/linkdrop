import { useEffect, useRef } from "react";

import type { User } from "~/lib/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

/**
 * https://usehooks.com/useMemoCompare/
 */
export function useMemoCompare<T>(
  next: T,
  compare: (prev: T | undefined, next: T) => boolean,
) {
  const previousRef = useRef<T>();
  const previous = previousRef.current;
  const isEqual = compare(previous, next);
  useEffect(() => {
    if (!isEqual) {
      previousRef.current = next;
    }
  });
  return isEqual ? previous! : next;
}

export type { User };
