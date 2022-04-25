import type { ShouldReloadFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import Demo from "~/components/Demo";
import Header from "~/components/Header";
import { useOptionalUser } from "~/utils";

type LoaderData = {
  allowSignUp: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const allowSignUp = process.env.ALLOW_EMAIL_JOIN === "true";

  return json<LoaderData>({ allowSignUp });
};

export const unstable_shouldReload: ShouldReloadFunction = () => false;

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const user = useOptionalUser();

  const mainHeightClasses = user ? "min-h-full" : "min-h-[85vh]";

  return (
    <div className="flex min-h-full flex-col justify-center px-2 sm:pb-16 sm:pt-8">
      <div className={`flex flex-col justify-center ${mainHeightClasses}`}>
        <Header
          size="large"
          mode={user ? "user" : "public"}
          allowSignUp={data.allowSignUp}
        />

        <main className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-lg text-center text-xl lowercase sm:max-w-3xl">
            An application to drop interesting links from around the internet.
            <br />a small project by{" "}
            <a
              href="https://sthom.kiwi"
              target="_blank"
              rel="noreferrer nofollow"
              className="text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
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
        </main>
      </div>

      {!user && (
        <aside className="mx-auto inline-block w-full max-w-lg sm:max-w-4xl">
          <hr className="my-4" />
          <p className="text-center lowercase">
            {data.allowSignUp
              ? "Before signing up, you can get the idea with a little demo"
              : "Signing up is currently disabled, but you can get the idea with a little demo"}
          </p>
          <Demo />
        </aside>
      )}
    </div>
  );
}
