export interface TagProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  name: string;
  isActive?: boolean;
  isNegative?: boolean;
}

export default function Tag({
  name,
  isActive,
  isNegative,
  className,
  ...props
}: TagProps) {
  const activeClasses = isNegative
    ? "bg-red-200 text-red-800 border-red-400 hover:text-red-900"
    : isActive
    ? "bg-neutral-300 text-neutral-900 border-neutral-400 hover:text-black"
    : "bg-neutral-100 text-neutral-600 hover:text-black";

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
