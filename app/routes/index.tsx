import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

type LoaderData = {
  allowSignUp: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const allowSignUp = process.env.ALLOW_EMAIL_JOIN === "true";

  return json<LoaderData>({ allowSignUp });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const user = useOptionalUser();

  return (
    <main className="relative min-h-screen flex-col bg-neutral-50 sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-center text-6xl font-normal italic tracking-tight sm:text-8xl lg:text-9xl">
            <span>link</span>
            <span className="inline-block translate-y-[0.06em] rotate-heading">
              drop
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-center text-xl lowercase sm:max-w-3xl">
            An application to drop interesting links from around the internet.
            <br />a small project by{" "}
            <a
              href="https://sthom.kiwi"
              target="_blank"
              rel="noreferrer noopener"
              className="text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:bg-neutral-800"
            >
              Stuart Thomson
            </a>
            .
          </p>
          <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
            {user ? (
              <Link
                to="/links"
                className="border border-black py-2 px-4 text-center lowercase text-black hover:bg-neutral-200 active:bg-neutral-400"
              >
                Your links
              </Link>
            ) : (
              <div className="space-y-4 sm:mx-auto sm:flex sm:gap-5 sm:space-y-0">
                {data.allowSignUp && (
                  <Link
                    to="/join"
                    className="w-24 border border-black py-2 px-4 text-center lowercase text-black hover:bg-neutral-200 active:bg-neutral-400"
                  >
                    Sign up
                  </Link>
                )}
                <Link
                  to="/login"
                  className="w-24 border border-black py-2 px-4 text-center lowercase text-black hover:bg-neutral-200 active:bg-neutral-400"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center text-center">
        <a
          href="https://github.com/s-thom/linkdrop"
          target="_blank"
          rel="noreferrer noopener"
          className="py-1 px-2 text-center lowercase text-neutral-400 hover:text-neutral-600 active:text-neutral-800"
        >
          Source code
        </a>
      </div>
    </main>
  );
}
