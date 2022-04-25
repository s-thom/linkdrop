import type { FormMethod } from "@remix-run/react";
import { Form, useFetcher } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { encodeStringArray } from "~/util/stringArray";
import { formValuesToSearchParams } from "~/util/useSearchFormState";
import { useTagsInput } from "~/util/useTagsInput";
import Tag from "./Tag";

export interface FormValues {
  url: string;
  description: string;
  tags: string[];
}

export interface FormErrors {
  url?: string;
  description?: string;
  tags?: string;
}

interface TagsLoaderData {
  commonTags: string[];
}

export interface LinkFormProps {
  method?: FormMethod;
  action?: string;
  initialValues: FormValues;
  errors?: FormErrors;
  i18n: {
    submit: string;
  };
}

export default function LinkForm({
  method = "post",
  action,
  initialValues,
  errors,
  i18n,
}: LinkFormProps) {
  const fetcher = useFetcher<TagsLoaderData>();

  // #region Focus on error
  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (errors?.url) {
      urlRef.current?.focus();
    }
  }, [errors]);
  // #endregion

  // #region Form state
  const [urlValue, setUrlValue] = useState(initialValues.url);
  const [descriptionValue, setDescriptionValue] = useState(
    initialValues.description
  );
  const [tagsValue, setTagsValue] = useState<string[]>(
    () => initialValues.tags
  );

  useEffect(() => {
    fetcher.load(
      `/tags?${formValuesToSearchParams({ tags: tagsValue }).toString()}`
    );
    // The eslint rule wants `fetcher` to be in the deps array.
    // This causes an infinite fetch loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.load, tagsValue]);

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
    () =>
      fetcher.data?.commonTags.filter((tag) => !tagsValue.includes(tag)) ?? [],
    [fetcher.data, tagsValue]
  );
  // #endregion

  const { input } = useTagsInput({ id: "_tag_entry", addTag });

  return (
    <Form method={method} action={action}>
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
            aria-invalid={errors?.url ? true : undefined}
            aria-describedby="url-error"
            className="w-full border border-gray-500 px-2 py-1 text-lg"
            value={urlValue}
            onChange={useCallback<React.ChangeEventHandler<HTMLInputElement>>(
              (event) => setUrlValue(event.target.value),
              []
            )}
          />
          {errors?.url && (
            <div className="pt-1 text-red-700" id="url-error">
              {errors.url}
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
              <Tag
                key={tag}
                name={tag}
                isActive
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag: ${tag}`}
              />
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
                <Tag
                  key={tag}
                  name={tag}
                  onClick={() => addTag(tag)}
                  aria-label={`Add tag: ${tag}`}
                />
              ))}
            </ul>
          </>
        ) : null}
        <input type="hidden" name="tags" value={encodeStringArray(tagsValue)} />
      </div>

      <button
        type="submit"
        className="w-full border border-black py-2 px-4 lowercase text-black hover:bg-neutral-200 active:bg-neutral-400"
      >
        {i18n.submit}
      </button>
    </Form>
  );
}
