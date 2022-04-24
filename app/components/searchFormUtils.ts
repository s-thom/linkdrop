import { useSearchParams } from "@remix-run/react";
import equal from "fast-deep-equal";
import { useCallback } from "react";
import { useMemoCompare } from "~/utils";
import type { FormValues } from "./SearchForm";

type Edit<T> = T extends Array<infer U>
  ? { add?: U[]; remove?: U[] }
  : T extends Object
  ? { [x in keyof T]?: Edit<T[x]> }
  : T;

function deduplicateArray<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function editArray<T>(arr: T[], changes: Edit<T[]>): T[] {
  return deduplicateArray(
    arr
      .filter((item) => !changes.remove?.includes(item))
      .concat(changes.add ?? [])
  );
}

function editObject<T extends {}>(obj: T, changes: Edit<T>): T {
  const out: Record<any, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const change = (changes as any)[key];
    if (change) {
      if (Array.isArray(value)) {
        out[key] = editArray(value, change);
      } else if (typeof value === "object" && value) {
        out[key] = editObject(value, change);
      } else {
        out[key] = change ?? value;
      }
    }
  }

  return out;
}

export function searchParamsToFormValues(params: URLSearchParams): FormValues {
  const paramsTagsRaw = params.get("tags");
  const tags = paramsTagsRaw
    ? paramsTagsRaw
        .split(/[,+ ]/)
        .map((tag) => decodeURIComponent(tag))
        .filter(Boolean)
        .sort()
    : [];

  return { tags };
}

export function formValuesToSearchParams(values: FormValues): URLSearchParams {
  const tags = values.tags
    .filter(Boolean)
    .sort()
    .map((tag) => encodeURIComponent(tag))
    .join(" ");

  return new URLSearchParams({ tags });
}

export function useSearchFormState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const formValues = useMemoCompare(
    searchParamsToFormValues(searchParams),
    equal
  );

  const setFormState = useCallback(
    (values: FormValues) =>
      setSearchParams(formValuesToSearchParams(values), { replace: true }),
    [setSearchParams]
  );

  const addTag = useCallback(
    (tag: string) => {
      const newValues = editObject(formValues, { tags: { add: [tag] } });
      setFormState(newValues);
    },
    [formValues, setFormState]
  );
  const removeTag = useCallback(
    (tag: string) => {
      const newValues = editObject(formValues, { tags: { remove: [tag] } });
      setFormState(newValues);
    },
    [formValues, setFormState]
  );

  return { formValues, addTag, removeTag };
}
