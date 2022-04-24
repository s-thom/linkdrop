import { useState, useCallback } from "react";

const INPUT_RESET_KEYS = [" ", ",", "+", "Enter"];

export interface UseTagsInputProps {
  initialValue?: string;
  addTag?: (tag: string) => void;
}

export function useTagsInput({ initialValue = "", addTag }: UseTagsInputProps) {
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
        addTag?.(tagInputValue);
        setTagInputValue("");
      }
    },
    [addTag, tagInputValue]
  );

  const input = (
    <input
      name="tags"
      placeholder="Enter tags"
      className="flex-1 border border-gray-400 px-2 py-1 text-lg"
      value={tagInputValue}
      onChange={onTagInputChange}
      onKeyDown={onTagInputKeyDown}
    />
  );

  return {
    input,
  };
}
