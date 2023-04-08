import type { FormMethod, FormProps } from "@remix-run/react";
import { Form, useFetcher } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { encodeStringArray } from "~/util/stringArray";
import { useDebounce } from "~/util/useDebounce";
import { formValuesToSearchParams } from "~/util/useSearchFormState";
import { useTagsInput } from "~/util/useTagsInput";
import { Link as LinkComponent } from "@remix-run/react";
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

interface DuplicateLoaderData {
  duplicateLinkIds: string[];
}

export interface LinkFormProps {
  method?: FormMethod;
  action?: string;
  initialValues: FormValues;
  errors?: FormErrors;
  i18n: {
    submit: string;
  };
  onSubmit?: FormProps["onSubmit"];
  currentLinkId?: string;
}

export default function LinkForm({
  method = "post",
  action,
  initialValues,
  errors,
  i18n,
  onSubmit,
  currentLinkId,
}: LinkFormProps) {
  const tagsFetcher = useFetcher<TagsLoaderData>();
  const duplicateFetcher = useFetcher<DuplicateLoaderData>();

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
    tagsFetcher.load(
      `/tags?${formValuesToSearchParams({ tags: tagsValue }).toString()}`
    );
    // The eslint rule wants `fetcher` to be in the deps array.
    // This causes an infinite fetch loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsFetcher.load, tagsValue]);

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
      tagsFetcher.data?.commonTags.filter((tag) => !tagsValue.includes(tag)) ??
      [],
    [tagsFetcher.data, tagsValue]
  );

  // Duplicate link check
  const debouncedUrl = useDebounce(urlValue, 200);
  useEffect(() => {
    // Avoid sending a request when we know it won't be valid
    if (debouncedUrl) {
      duplicateFetcher.load(
        `/links/check-duplicate?${new URLSearchParams({
          url: debouncedUrl,
        }).toString()}`
      );
    }
    // The eslint rule wants `fetcher` to be in the deps array.
    // This causes an infinite fetch loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duplicateFetcher.load, debouncedUrl]);
  const duplicateLinks = duplicateFetcher.data?.duplicateLinkIds ?? [];
  const isCurrentLink = currentLinkId && duplicateLinks.includes(currentLinkId);
  // #endregion

  const { input } = useTagsInput({ id: "_tag_entry", addTag });

  return (
    <Form method={method} action={action} onSubmit={onSubmit}>
      <div className="my-2">
        <label
          htmlFor="url"
          className="block text-sm font-medium lowercase text-label"
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
            className="w-full border border-input-border bg-input px-2 py-1 text-lg"
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
          {duplicateLinks.length > 0 && !isCurrentLink && (
            <div className="lowercase text-yellow-700" id="duplicate-warning">
              This link has been saved before.{" "}
              <LinkComponent
                className="p-1 text-nav-link hover:text-nav-link hover:no-underline active:text-nav-link-active"
                to={`/links/${duplicateLinks[0]}`}
              >
                View saved link
              </LinkComponent>
            </div>
          )}
        </div>
      </div>

      <div className="my-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium lowercase text-label"
        >
          Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full resize-y border border-input-border bg-input px-2 py-1 text-lg"
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
          className="block text-sm font-medium lowercase text-label"
        >
          Tags
        </label>
        {tagsValue.length ? (
          <ul className="flex flex-wrap gap-2 py-2">
            {tagsValue.map((tag) => (
              <Tag
                key={tag}
                name={tag}
                state="active"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag: ${tag}`}
              />
            ))}
          </ul>
        ) : (
          <p className="py-2 text-sm text-text-diminished">No tags entered</p>
        )}
        <div className="mt-1">{input}</div>
        {remainingCommonTags.length ? (
          <>
            <span className="block text-sm font-medium lowercase text-text-diminished">
              Common tags
            </span>
            <ul className="flex flex-wrap gap-2 py-2">
              {remainingCommonTags.map((tag) => (
                <Tag
                  key={tag}
                  name={tag}
                  state="inactive"
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
        className="border-button-border hover:bg-button-hover active:bg-button-active w-full border py-2 px-4 lowercase text-text"
      >
        {i18n.submit}
      </button>
    </Form>
  );
}
