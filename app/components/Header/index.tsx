import { Link } from "@remix-run/react";
import { PublicNav } from "./PublicNav";
import { UserNav } from "./UserNav";
import { LinkDropText } from "../LinkDropText";

const DEFAULT_TEXT = { link: "link", drop: "drop" };

export interface HeaderProps {
  text?: { link: string; drop: string };
  size: "large" | "small";
  mode: "user" | "public" | "none";
  allowSignUp?: boolean;
}

export default function Header({
  size,
  mode,
  allowSignUp = false,
  text = DEFAULT_TEXT,
}: HeaderProps) {
  const fontClasses =
    size === "large" ? "mb-6 text-6xl sm:text-8xl lg:text-9xl" : "text-3xl";
  const containerClasses =
    size === "large" ? "" : "border-b border-card-border";

  return (
    <header
      className={`flex flex-col items-center justify-between p-2 ${containerClasses}`}
    >
      <h1
        className={`whitespace-nowrap text-center font-normal tracking-tight ${fontClasses}`}
      >
        <Link to="/">
          <LinkDropText link={text.link} drop={text.drop} />
        </Link>
      </h1>
      {mode !== "none" && (
        <nav className="flex gap-2">
          {mode === "public" && <PublicNav allowSignUp={allowSignUp} />}
          {mode === "user" && <UserNav />}
        </nav>
      )}
    </header>
  );
}
