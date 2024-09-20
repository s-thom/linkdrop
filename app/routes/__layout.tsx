import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { useEffect } from "react";
import Header from "~/components/Header";
import { useUser } from "~/utils";

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export default function Layout() {
  const user = useUser();

  useEffect(() => {
    (window.umami as any)?.identify({ id: user.id });
  }, [user.id]);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header size="small" mode="user" />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
