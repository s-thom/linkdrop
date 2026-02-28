import equal from "fast-deep-equal";
import { useCallback, useEffect, useState } from "react";
import { useMemoCompare } from "~/utils";
import type { FormValues } from "~/components/SearchForm";
import { decodeStringArray, encodeStringArray } from "./stringArray";

type Edit<T> = T extends Array<infer U>
  ? { add?: U[]; remove?: U[] }
  : T extends object
    ? { [x in keyof T]?: Edit<T[x]> }
    : T;

function deduplicateArray<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function editArray<T>(arr: T[], changes: Edit<T[]>): T[] {
  return deduplicateArray(
    arr
      .filter((item) => !changes.remove?.includes(item))
      .concat(changes.add ?? []),
  );
}

function editObject<T extends object>(obj: T, changes: Edit<T>): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const change = (changes as Record<string, unknown>)[key];
    if (change) {
      if (Array.isArray(value)) {
        out[key] = editArray(value, change as Edit<unknown[]>);
      } else if (typeof value === "object" && value) {
        out[key] = editObject(value as object, change as Edit<object>);
      } else {
        out[key] = change ?? value;
      }
    } else {
      out[key] = value;
    }
  }
  return out as T;
}

export function searchParamsToFormValues(params: URLSearchParams): FormValues {
  const paramsTagsRaw = params.get("tags");
  const tags = decodeStringArray(paramsTagsRaw ?? "");
  return { tags };
}

export function formValuesToSearchParams(values: FormValues): URLSearchParams {
  const tags = encodeStringArray(values.tags.filter(Boolean).sort());
  return new URLSearchParams({ tags });
}

function useUrlSearchParams(): [
  URLSearchParams,
  (params: URLSearchParams, options?: { replace?: boolean }) => void,
] {
  const [searchParams, setSearchParamsState] = useState<URLSearchParams>(
    () =>
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams(),
  );

  const setSearchParams = useCallback(
    (params: URLSearchParams, options?: { replace?: boolean }) => {
      const url = new URL(window.location.href);
      url.search = params.toString();
      if (options?.replace) {
        window.history.replaceState({}, "", url.toString());
      } else {
        window.history.pushState({}, "", url.toString());
      }
      setSearchParamsState(new URLSearchParams(params));
    },
    [],
  );

  useEffect(() => {
    const handlePopState = () => {
      setSearchParamsState(new URLSearchParams(window.location.search));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return [searchParams, setSearchParams];
}

export function useSearchFormState() {
  const [searchParams, setSearchParams] = useUrlSearchParams();

  const values = useMemoCompare(searchParamsToFormValues(searchParams), equal);

  const setFormState = useCallback(
    (values: FormValues) =>
      setSearchParams(formValuesToSearchParams(values), { replace: true }),
    [setSearchParams],
  );

  const addTag = useCallback(
    (tag: string) => {
      const newValues = editObject(values, { tags: { add: [tag] } });
      setFormState(newValues);
    },
    [values, setFormState],
  );

  const removeTag = useCallback(
    (tag: string) => {
      const newValues = editObject(values, { tags: { remove: [tag] } });
      setFormState(newValues);
    },
    [values, setFormState],
  );

  return { values, addTag, removeTag };
}
