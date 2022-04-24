import { useCallback, useState } from "react";
import { useSearchFormState } from "./searchFormUtils";

const INPUT_RESET_KEYS = [" ", ",", "+", "Enter"];

export interface FormValues {
  tags: string[];
}

export interface SearchFormProps {
  commonTags: string[];
}

export default function SearchForm({ commonTags }: SearchFormProps) {
  const { formValues, addTag, removeTag } = useSearchFormState();

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
    <div>
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
        {commonTags
          .filter((tag) => !formValues.tags.includes(tag))
          .map((tag) => (
            <button
              key={tag}
              className="inline-block rounded border bg-neutral-100 py-0 px-2 text-neutral-600 hover:text-black"
              onClick={() => addTag(tag)}
              aria-label={`Add tag: ${tag}`}
            >
              {tag}
            </button>
          ))}
      </ul>
    </div>
  );
}
