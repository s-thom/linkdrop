import { Form, Link } from "@remix-run/react";

const DEFAULT_TEXT = { link: "link", drop: "drop" };

export interface HeaderProps {
  text?: { link: string; drop: string };
  size: "large" | "small";
  mode: "user" | "public" | "none";
  allowSignUp?: boolean;
}

function renderPublicNav(allowSignUp: boolean) {
  return (
    <>
      {allowSignUp && (
        <Link
          to="/join"
          className="lowercase text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
        >
          Sign up
        </Link>
      )}
      <Link
        to="/login"
        className="lowercase text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
      >
        Log In
      </Link>
    </>
  );
}

function renderUserNav() {
  return (
    <>
      <Link
        to="/links"
        className="lowercase text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
      >
        Your links
      </Link>
      <Link
        to="/links/new"
        className="lowercase text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
      >
        New link
      </Link>
      <Form
        action="/logout"
        method="post"
        className="inline-block items-center"
      >
        <button
          type="submit"
          className="lowercase text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
        >
          Log out
        </button>
      </Form>
    </>
  );
}

export default function Header({
  size,
  mode,
  allowSignUp = false,
  text = DEFAULT_TEXT,
}: HeaderProps) {
  const fontClasses =
    size === "large" ? "mb-6 text-6xl sm:text-8xl lg:text-9xl" : "text-3xl";
  const containerClasses = size === "large" ? "" : "border-b";

  return (
    <header
      className={`flex flex-col items-center justify-between p-2 ${containerClasses}`}
    >
      <h1
        className={`whitespace-nowrap text-center font-normal italic tracking-tight ${fontClasses}`}
      >
        <Link to="/">
          <span>{text.link}</span>
          <span className="inline-block translate-y-[0.06em] rotate-heading">
            {text.drop}
          </span>
        </Link>
      </h1>
      {mode !== "none" && (
        <nav className="flex gap-2">
          {mode === "public" && renderPublicNav(allowSignUp)}
          {mode === "user" && renderUserNav()}
        </nav>
      )}
    </header>
  );
}
