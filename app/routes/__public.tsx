import { Outlet } from "@remix-run/react";
import Header from "~/components/Header";
import { useOptionalUser } from "~/utils";

export default function PublicLayout() {
  const user = useOptionalUser();

  return (
    <div className="flex min-h-full flex-col justify-center sm:pb-16 sm:pt-8">
      <Header size="large" mode={user ? "user" : "public"} />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
