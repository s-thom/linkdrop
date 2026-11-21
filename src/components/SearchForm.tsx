import { inferTagStateFromName, useTagsInput } from "~/lib/util/useTagsInput";
import Tag from "./Tag";

export interface FormValues {
  tags: string[];
}

export interface SearchFormProps {
  commonTags: string[];
  values: FormValues;
  addTag?: (tag: string) => void;
  removeTag?: (tag: string) => void;
}

export default function SearchForm({
  commonTags,
  values,
  addTag,
  removeTag,
}: SearchFormProps) {
  const { input } = useTagsInput({
    addTag,
    allowNegative: true,
    allowPositive: true,
  });

  return (
    <div>
      <h3 className="section-title">Search</h3>
      {values.tags.length ? (
        <ul className="tag-list padded">
          {values.tags.map((tag) => (
            <Tag
              key={tag}
              component="button"
              name={tag}
              state={inferTagStateFromName(tag) ?? "active"}
              disabled={!removeTag}
              onClick={removeTag && (() => removeTag(tag))}
              aria-label={`Remove tag: ${tag}`}
            />
          ))}
        </ul>
      ) : (
        <p className="no-tags">No tags selected</p>
      )}

      <label>
        <span className="sr-only">Enter tags</span>
        {input}
      </label>
      {commonTags.length ? (
        <>
          <h3 className="section-title">Common tags</h3>
          <ul className="tag-list padded">
            {commonTags
              .filter((tag) => !values.tags.includes(tag))
              .map((tag) => (
                <Tag
                  key={tag}
                  component="button"
                  name={tag}
                  state="inactive"
                  disabled={!addTag}
                  onClick={addTag && (() => addTag(tag))}
                  aria-label={`Add tag: ${tag}`}
                />
              ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
