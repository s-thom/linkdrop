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
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <p className="mx-auto max-w-lg text-center text-xl lowercase sm:max-w-3xl">
        An application to drop interesting links from around the internet.
        <br />a small project by{" "}
        <a
          href="https://sthom.kiwi"
          target="_blank"
          rel="noreferrer nofollow"
          className="text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:bg-neutral-800"
        >
          Stuart Thomson
        </a>
        .{" "}
        <a
          href="https://github.com/s-thom/linkdrop"
          target="_blank"
          rel="noreferrer nofollow"
          className="text-center lowercase text-neutral-400 underline decoration-1 hover:text-neutral-500 hover:no-underline active:bg-neutral-600"
        >
          (Source code)
        </a>
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
  );
}
