export type TagState = "inactive" | "active" | "positive" | "negative";

export interface TagProps extends React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  name: string;
  state: TagState;
  component: "button" | "span";
}

export default function Tag({
  name,
  state,
  className,
  component = "button",
  ...props
}: TagProps) {
  const classes = ["tag", state === "inactive" ? null : state, className]
    .filter(Boolean)
    .join(" ");

  if (component === "span") {
    return (
      <span className={classes} {...props}>
        {name}
      </span>
    );
  }

  return (
    <button type={props.type ?? "button"} className={classes} {...props}>
      {name}
    </button>
  );
}
