export type TagState = "inactive" | "active" | "positive" | "negative";

export interface TagProps
  extends React.DetailedHTMLProps<
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
        "bg-neutral-300 text-neutral-900 border-neutral-400 hover:text-black";
      break;
    case "inactive":
      activeClasses = "bg-neutral-100 text-neutral-600 hover:text-black";
      break;
    case "positive":
      activeClasses = "";
      break;
    case "negative":
      activeClasses =
        "bg-red-200 text-red-800 border-red-400 hover:text-red-900";
      break;
    default:
      activeClasses = "";
  }

  return (
    <button
      type={props.type ?? "button"}
      className={`inline-block rounded border py-0 px-2 hover:text-black ${activeClasses} ${className}`}
      {...props}
    >
      {name}
    </button>
  );
}
