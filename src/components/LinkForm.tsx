import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { encodeStringArray } from "~/lib/util/stringArray";
import { useDebounce } from "~/lib/util/useDebounce";
import { formValuesToSearchParams } from "~/lib/util/useSearchFormState";
import { useTagsInput } from "~/lib/util/useTagsInput";
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
  method?: string;
  action?: string;
  initialValues: FormValues;
  errors?: FormErrors;
  i18n: {
    submit: string;
  };
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  currentLinkId?: string;
  csrfToken?: string;
}

export default function LinkForm({
  method = "post",
  action,
  initialValues,
  errors,
  i18n,
  onSubmit,
  currentLinkId,
  csrfToken,
}: LinkFormProps) {
  const [tagsData, setTagsData] = useState<TagsLoaderData | null>(null);
  const [duplicateData, setDuplicateData] =
    useState<DuplicateLoaderData | null>(null);

  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (errors?.url) {
      urlRef.current?.focus();
    }
  }, [errors]);

  const [urlValue, setUrlValue] = useState(initialValues.url);
  const [descriptionValue, setDescriptionValue] = useState(
    initialValues.description,
  );
  const [tagsValue, setTagsValue] = useState<string[]>(
    () => initialValues.tags,
  );

  useEffect(() => {
    const params = formValuesToSearchParams({ tags: tagsValue });
    fetch(`/tags?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setTagsData(data))
      .catch(() => {});
  }, [tagsValue]);

  const addTag = useCallback((tag: string) => {
    setTagsValue((prev) => {
      if (!tag || prev.includes(tag)) return prev;
      return prev.concat(tag).sort();
    });
  }, []);

  const removeTag = useCallback((tag: string) => {
    setTagsValue((prev) => prev.filter((t) => t !== tag));
  }, []);

  const remainingCommonTags = useMemo(
    () => tagsData?.commonTags.filter((tag) => !tagsValue.includes(tag)) ?? [],
    [tagsData, tagsValue],
  );

  const debouncedUrl = useDebounce(urlValue, 200);
  useEffect(() => {
    if (debouncedUrl) {
      fetch(
        `/links/check-duplicate?${new URLSearchParams({ url: debouncedUrl }).toString()}`,
      )
        .then((r) => r.json())
        .then((data) => setDuplicateData(data))
        .catch(() => {});
    }
  }, [debouncedUrl]);

  const duplicateLinks = duplicateData?.duplicateLinkIds ?? [];
  const isCurrentLink = currentLinkId && duplicateLinks.includes(currentLinkId);

  const { input } = useTagsInput({ id: "_tag_entry", addTag });

  return (
    <form method={method} action={action} onSubmit={onSubmit}>
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
              [],
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
              <a
                className="p-1 text-nav-link hover:text-nav-link hover:no-underline active:text-nav-link-active"
                href={`/links/${duplicateLinks[0]}`}
              >
                View saved link
              </a>
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
        {csrfToken && <input type="hidden" name="__csrf" value={csrfToken} />}
      </div>

      <button
        type="submit"
        className="w-full border border-button-border px-4 py-2 lowercase text-text hover:bg-button-hover active:bg-button-active"
      >
        {i18n.submit}
      </button>
    </form>
  );
}
