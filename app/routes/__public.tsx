import type { ShouldReloadFunction } from "@remix-run/react";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
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

export default function PublicLayout() {
  const data = useLoaderData<LoaderData>();
  const user = useOptionalUser();

  return (
    <div className="flex min-h-full flex-col justify-center sm:pb-16 sm:pt-8">
      <Header
        size="large"
        mode={user ? "user" : "public"}
        allowSignUp={data.allowSignUp}
      />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
