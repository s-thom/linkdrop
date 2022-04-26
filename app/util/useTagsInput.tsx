import { useState, useCallback } from "react";
import { decodeStringArray } from "./stringArray";

const INPUT_RESET_KEYS = [" ", ",", "+", "Enter"];

export interface UseTagsInputProps {
  id?: string;
  initialValue?: string;
  addTag?: (tag: string) => void;
  allowNegative?: boolean;
}

export function useTagsInput({
  id,
  initialValue = "",
  addTag,
  allowNegative,
}: UseTagsInputProps) {
  const [tagInputValue, setTagInputValue] = useState(initialValue);
  const onTagInputChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >((event) => setTagInputValue(event.target.value), []);
  const onTagInputKeyDown = useCallback<
    React.KeyboardEventHandler<HTMLInputElement>
  >(
    (event) => {
      if (INPUT_RESET_KEYS.includes(event.key)) {
        event.preventDefault();
        if (addTag) {
          decodeStringArray(tagInputValue).forEach((tag) => {
            if (allowNegative) {
              addTag(tag);
            } else {
              addTag(tag.replace(/^-/, ""));
            }
          });
        }
        setTagInputValue("");
      }
    },
    [addTag, allowNegative, tagInputValue]
  );

  const input = (
    <input
      id={id}
      name={id ?? "_tag_entry"}
      placeholder="Enter tags"
      className="w-full flex-1 border border-gray-400 px-2 py-1 text-lg"
      autoCapitalize="off"
      autoComplete="off"
      value={tagInputValue}
      onChange={onTagInputChange}
      onKeyDown={onTagInputKeyDown}
    />
  );

  return {
    input,
  };
}
