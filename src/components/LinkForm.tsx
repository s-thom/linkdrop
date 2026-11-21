import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { encodeStringArray } from "~/lib/util/stringArray";
import { useDebounce } from "~/lib/util/useDebounce";
import { formValuesToSearchParams } from "~/lib/util/useSearchFormState";
import { useTagsInput } from "~/lib/util/useTagsInput";
import styles from "./LinkForm.module.css";
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
      <div className="field">
        <label htmlFor="url" className="label">
          URL
        </label>
        <div>
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
            className="input"
            value={urlValue}
            onChange={useCallback<React.ChangeEventHandler<HTMLInputElement>>(
              (event) => setUrlValue(event.target.value),
              [],
            )}
          />
          {errors?.url && (
            <div className="field-error" id="url-error">
              {errors.url}
            </div>
          )}
          {duplicateLinks.length > 0 && !isCurrentLink && (
            <div className="warning" id="duplicate-warning">
              This link has been saved before.{" "}
              <a
                className={styles["duplicate-link"]}
                href={`/links/${duplicateLinks[0]}`}
              >
                View saved link
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="description" className="label">
          Description
        </label>
        <div>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="input"
            value={descriptionValue}
            onChange={useCallback<
              React.ChangeEventHandler<HTMLTextAreaElement>
            >((event) => setDescriptionValue(event.target.value), [])}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="_tag_entry" className="label">
          Tags
        </label>
        {tagsValue.length ? (
          <ul className="tag-list padded">
            {tagsValue.map((tag) => (
              <Tag
                component="button"
                key={tag}
                name={tag}
                state="active"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag: ${tag}`}
              />
            ))}
          </ul>
        ) : (
          <p className="no-tags">No tags entered</p>
        )}
        {input}
        {remainingCommonTags.length ? (
          <>
            <span className="label diminished">Common tags</span>
            <ul className="tag-list padded">
              {remainingCommonTags.map((tag) => (
                <Tag
                  component="button"
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

      <button type="submit" className="button">
        {i18n.submit}
      </button>
    </form>
  );
}
