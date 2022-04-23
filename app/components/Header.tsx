import { Form, Link } from "@remix-run/react";

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-between border-b p-2">
      <h1 className="text-3xl font-bold">
        <Link to="/" className="whitespace-nowrap font-normal italic">
          <span>link</span>
          <span className="inline-block translate-y-[0.06em] rotate-heading">
            drop
          </span>
        </Link>
      </h1>
      <nav className="flex gap-2">
        <Link
          to="new"
          className="lowercase text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:bg-neutral-800"
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
            className="lowercase text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:bg-neutral-800"
          >
            Log out
          </button>
        </Form>
      </nav>
    </header>
  );
}
