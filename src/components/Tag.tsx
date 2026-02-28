export type TagState = "inactive" | "active" | "positive" | "negative";

export interface TagProps extends React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  name: string;
  state: TagState;
}

export default function Tag({ name, state, className, ...props }: TagProps) {
  let activeClasses: string;
  switch (state) {
    case "active":
      activeClasses =
        "bg-tag-active text-tag-active-text border-tag-active-border hover:bg-tag-active-hover";
      break;
    case "inactive":
      activeClasses =
        "bg-tag text-tag-text border-tag-border hover:bg-tag-hover";
      break;
    case "positive":
      activeClasses =
        "bg-tag-positive text-tag-positive-text border-tag-positive-border hover:bg-tag-positive-hover";
      break;
    case "negative":
      activeClasses =
        "bg-tag-negative text-tag-negative-text border-tag-negative-border hover:bg-tag-negative-hover";
      break;
    default:
      activeClasses = "hover:text-text";
  }

  return (
    <button
      type={props.type ?? "button"}
      className={`inline-block rounded border px-2 py-0 ${activeClasses} ${className}`}
      {...props}
    >
      {name}
    </button>
  );
}
