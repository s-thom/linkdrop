import { Outlet } from "@remix-run/react";
import Header from "~/components/Header";

export default function Layout() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
