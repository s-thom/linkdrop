import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import equal from "fast-deep-equal";
import React, { useCallback, useState } from "react";
import LinkDisplay from "~/components/LinkDisplay";
import { getUserLinksByTags } from "~/models/link.server";
import { getUserCommonTags } from "~/models/tag.server";
import { requireUserId } from "~/session.server";
import { useMemoCompare } from "~/utils";

const INPUT_RESET_KEYS = [" ", ",", "+", "Enter"];

interface FormValues {
  tags: string[];
}

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

function searchParamsToFormValues(params: URLSearchParams): FormValues {
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

function formValuesToSearchParams(values: FormValues): URLSearchParams {
  const tags = values.tags
    .filter(Boolean)
    .sort()
    .map((tag) => encodeURIComponent(tag))
    .join(" ");

  return new URLSearchParams({ tags });
}

type LoaderData = {
  links: Awaited<ReturnType<typeof getUserLinksByTags>>;
  commonTags: Awaited<ReturnType<typeof getUserCommonTags>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const { tags } = searchParamsToFormValues(url.searchParams);

  const [commonTags, links] = await Promise.all([
    getUserCommonTags({ userId }),
    getUserLinksByTags({ userId, tags }),
  ]);

  return json<LoaderData>({ links, commonTags });
};

export default function LinksIndexPage() {
  const data = useLoaderData<LoaderData>();
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

  const [tagInputValue, setTagInputValue] = useState("");
  const onTagInputChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >((event) => setTagInputValue(event.target.value), []);
  const onTagInputKeyDown = useCallback<
    React.KeyboardEventHandler<HTMLInputElement>
  >(
    (event) => {
      if (INPUT_RESET_KEYS.includes(event.key)) {
        event.preventDefault();
        addTag(tagInputValue);
        setTagInputValue("");
      }
    },
    [addTag, tagInputValue]
  );

  return (
    <div className="flex h-full min-h-screen flex-col md:flex-row md:justify-center">
      <aside className="p-6 md:h-full md:w-80 md:pr-0">
        <h3 className="text-xl font-normal lowercase">Search</h3>
        <ul className="flex flex-wrap gap-2">
          {formValues.tags.map((tag) => (
            <button
              key={tag}
              className="inline-block rounded border bg-neutral-100 py-0 px-2 text-neutral-600 hover:text-black"
              onClick={() => removeTag(tag)}
              aria-label={`Remove tag: ${tag}`}
            >
              {tag}
            </button>
          ))}
        </ul>
        <label className="flex w-full flex-col gap-1">
          <span className="sr-only">Enter tags</span>
          <input
            name="tags"
            placeholder="Enter tags"
            className="flex-1 border border-gray-500 px-2 py-1 text-lg"
            value={tagInputValue}
            onChange={onTagInputChange}
            onKeyDown={onTagInputKeyDown}
          />
        </label>
        <hr />
        <h3 className="text-xl font-normal lowercase">Common tags</h3>
        <ul className="flex flex-wrap gap-2">
          {data.commonTags
            .filter((tag) => !formValues.tags.includes(tag.name))
            .map((tag) => (
              <button
                key={tag.id}
                className="inline-block rounded border bg-neutral-100 py-0 px-2 text-neutral-600 hover:text-black"
                onClick={() => addTag(tag.name)}
                aria-label={`Add tag: ${tag.name}`}
              >
                {tag.name}
              </button>
            ))}
        </ul>
      </aside>

      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        <ul>
          {data.links.map((link) => (
            <li key={link.id}>
              <LinkDisplay link={link} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
