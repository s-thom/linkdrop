import { useTagsInput } from "~/util/useTagsInput";
import { useSearchFormState } from "../util/useSearchFormState";
import Tag from "./Tag";

export interface FormValues {
  tags: string[];
}

export interface SearchFormProps {
  commonTags: string[];
}

export default function SearchForm({ commonTags }: SearchFormProps) {
  const { formValues, addTag, removeTag } = useSearchFormState();

  const { input } = useTagsInput({ addTag });

  return (
    <div>
      <h3 className="text-xl font-normal lowercase">Search</h3>
      {formValues.tags.length ? (
        <ul className="flex flex-wrap gap-2 py-2">
          {formValues.tags.map((tag) => (
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
              .filter((tag) => !formValues.tags.includes(tag))
              .map((tag) => (
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
    </div>
  );
}
