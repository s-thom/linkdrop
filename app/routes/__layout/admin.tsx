import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { NavigationLink } from "~/components/Header/NavigationLink";
import { getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);

  if (!user || !user.isAdmin) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json({});
};

export default function AdminIndexPage() {
  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <aside className="p-6 md:h-full md:w-60 md:pr-0">
        <h3 className="text-xl font-normal lowercase">Admin</h3>
        <nav>
          <ul>
            <li>
              <NavigationLink to="/admin" end>
                Admin
              </NavigationLink>
            </li>
            <li>
              <NavigationLink to="/admin/users">Users</NavigationLink>
            </li>
            <li>
              <NavigationLink to="/admin/invites">Invites</NavigationLink>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        <Outlet />
      </main>
    </div>
  );
}
