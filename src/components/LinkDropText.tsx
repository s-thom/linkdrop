export interface LinkDropTextProps {
  link?: string;
  drop?: string;
}

export function LinkDropText({
  link = "link",
  drop = "drop",
}: LinkDropTextProps) {
  return (
    <span className="italic">
      <span>{link}</span>
      <span className="inline-block translate-y-[0.06em] rotate-heading">
        {drop}
      </span>
    </span>
  );
}
