import { Outlet } from "@remix-run/react";

export default function PublicLayout() {
  return (
    <div className="flex min-h-full flex-col justify-center sm:pb-16 sm:pt-8">
      <h1 className="mb-6 text-center text-6xl font-normal italic tracking-tight sm:text-8xl lg:text-9xl">
        <span>link</span>
        <span className="inline-block translate-y-[0.06em] rotate-heading">
          drop
        </span>
      </h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
