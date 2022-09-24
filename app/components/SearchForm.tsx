import { inferTagStateFromName, useTagsInput } from "~/util/useTagsInput";
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
  const { input } = useTagsInput({ addTag, allowNegative: true });

  return (
    <div>
      <h3 className="text-xl font-normal lowercase">Search</h3>
      {values.tags.length ? (
        <ul className="flex flex-wrap gap-2 py-2">
          {values.tags.map((tag) => (
            <Tag
              key={tag}
              name={tag}
              state={inferTagStateFromName(tag) ?? "active"}
              disabled={!removeTag}
              onClick={removeTag && (() => removeTag(tag))}
              aria-label={`Remove tag: ${tag}`}
            />
          ))}
        </ul>
      ) : (
        <p className="py-2 text-sm text-neutral-400">No tags selected</p>
      )}

      <label className="flex w-full flex-col gap-1">
        <span className="sr-only">Enter tags</span>
        {input}
      </label>
      {commonTags.length ? (
        <>
          <h3 className="text-xl font-normal lowercase">Common tags</h3>
          <ul className="flex flex-wrap gap-2 py-2">
            {commonTags
              .filter((tag) => !values.tags.includes(tag))
              .map((tag) => (
                <Tag
                  key={tag}
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
