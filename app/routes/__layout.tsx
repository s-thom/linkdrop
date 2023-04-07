import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import Header from "~/components/Header";

type LoaderData = {
  allowSignUp: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const allowSignUp = process.env.ALLOW_EMAIL_JOIN === "true";

  return json<LoaderData>({ allowSignUp });
};

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export default function Layout() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header size="small" mode="user" allowSignUp={data.allowSignUp} />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
