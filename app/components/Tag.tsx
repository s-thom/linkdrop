import React from "react";

export interface TagProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  name: string;
  isActive?: boolean;
}

export default function Tag({ name, isActive, className, ...props }: TagProps) {
  const activeClasses = isActive
    ? "bg-neutral-300 text-neutral-900 border-neutral-400"
    : "bg-neutral-100 text-neutral-600";

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
