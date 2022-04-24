import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import React, { useCallback, useMemo, useState } from "react";
import { createLink } from "~/models/link.server";
import { getUserCommonTags } from "~/models/tag.server";
import { requireUserId } from "~/session.server";
import { decodeStringArray, encodeStringArray } from "~/util/stringArray";
import { useTagsInput } from "~/util/useTagsInput";

export const handle = { hydrate: true };

interface FormValues {
  url: string;
  description: string;
  tags: string[];
}

type LoaderData = {
  commonTags: string[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const commonTags = await getUserCommonTags({ userId });

  return json<LoaderData>({
    commonTags: commonTags.map((tag) => tag.name),
  });
};

interface ActionData {
  errors?: Partial<Record<keyof FormValues, string>>;
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  // #region Validation
  const url = formData.get("url");
  if (typeof url !== "string") {
    return json<ActionData>(
      { errors: { url: "URL is not valid" } },
      { status: 400 }
    );
  }
  const description = formData.get("description") ?? "";
  if (typeof description !== "string") {
    return json<ActionData>(
      { errors: { description: "Description is not valid" } },
      { status: 400 }
    );
  }
  const tagsRaw = formData.get("tags") ?? "";
  if (typeof tagsRaw !== "string") {
    return json<ActionData>(
      { errors: { tags: "Description is not valid" } },
      { status: 400 }
    );
  }
  const tags = decodeStringArray(tagsRaw ?? "");
  // If the _tag_entry value is set, the user probably didn't hit enter. They'll probably still want this tag, though.
  if (formData.has("_tag_entry")) {
    const unsavedTag = formData.get("_tag_entry");
    if (typeof unsavedTag === "string" && unsavedTag) {
      tags.push(unsavedTag);
    }
  }
  // #endregion

  const link = await createLink({ userId, url, description, tags });

  return redirect(`/links/${link.id}`);
};

export default function NewLinkPage() {
  const data = useLoaderData<LoaderData>();

  // #region Focus on error
  const actionData = useActionData() as ActionData;
  const urlRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.url) {
      urlRef.current?.focus();
    }
  }, [actionData]);
  // #endregion

  // #region Form state
  const [urlValue, setUrlValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [tagsValue, setTagsValue] = useState<string[]>([]);

  const addTag = useCallback((tag: string) => {
    setTagsValue((prev) => {
      if (!tag || prev.includes(tag)) {
        return prev;
      }
      return prev.concat(tag).sort();
    });
  }, []);
  const removeTag = useCallback((tag: string) => {
    setTagsValue((prev) => prev.filter((t) => t !== tag));
  }, []);

  const remainingCommonTags = useMemo(
    () => data.commonTags.filter((tag) => !tagsValue.includes(tag)),
    [data.commonTags, tagsValue]
  );
  // #endregion

  const { input } = useTagsInput({ id: "_tag_entry", addTag });

  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        <Form method="post">
          <div className="my-2">
            <label
              htmlFor="url"
              className="block text-sm font-medium lowercase text-gray-700"
            >
              URL
            </label>
            <div className="mt-1">
              <input
                ref={urlRef}
                id="url"
                required
                autoFocus={true}
                name="url"
                type="url"
                autoComplete="url"
                aria-invalid={actionData?.errors?.url ? true : undefined}
                aria-describedby="url-error"
                className="w-full border border-gray-500 px-2 py-1 text-lg"
                value={urlValue}
                onChange={useCallback<
                  React.ChangeEventHandler<HTMLInputElement>
                >((event) => setUrlValue(event.target.value), [])}
              />
              {actionData?.errors?.url && (
                <div className="pt-1 text-red-700" id="url-error">
                  {actionData.errors.url}
                </div>
              )}
            </div>
          </div>

          <div className="my-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium lowercase text-gray-700"
            >
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full resize-y border border-gray-500 px-2 py-1 text-lg"
                value={descriptionValue}
                onChange={useCallback<
                  React.ChangeEventHandler<HTMLTextAreaElement>
                >((event) => setDescriptionValue(event.target.value), [])}
              />
            </div>
          </div>

          <div className="my-2">
            <label
              htmlFor="_tag_entry"
              className="block text-sm font-medium lowercase text-gray-700"
            >
              Tags
            </label>
            {tagsValue.length ? (
              <ul className="flex flex-wrap gap-2 py-2">
                {tagsValue.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="inline-block rounded border bg-neutral-100 py-0 px-2 text-neutral-600 hover:text-black"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove tag: ${tag}`}
                  >
                    {tag}
                  </button>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-neutral-400">No tags entered</p>
            )}
            <div className="mt-1">{input}</div>
            {remainingCommonTags.length ? (
              <>
                <span className="block text-sm font-medium lowercase text-neutral-400">
                  Common tags
                </span>
                <ul className="flex flex-wrap gap-2 py-2">
                  {remainingCommonTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="inline-block rounded border bg-neutral-100 py-0 px-2 text-neutral-600 hover:text-black"
                      onClick={() => addTag(tag)}
                      aria-label={`Add tag: ${tag}`}
                    >
                      {tag}
                    </button>
                  ))}
                </ul>
              </>
            ) : null}
            <input
              type="hidden"
              name="tags"
              value={encodeStringArray(tagsValue)}
            />
          </div>

          <button
            type="submit"
            className="w-full border border-black py-2 px-4 lowercase text-black hover:bg-neutral-200 active:bg-neutral-400"
          >
            Save link
          </button>
        </Form>
      </main>
    </div>
  );
}
