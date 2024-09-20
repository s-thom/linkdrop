import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { NavigationLink } from "~/components/Header/NavigationLink";
import { getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { useEventCallback } from "~/util/analytics";

type LoaderData = {
  isAdmin: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);

  if (!user) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json<LoaderData>({ isAdmin: user.isAdmin });
};

export default function UserIndexPage() {
  const { isAdmin } = useLoaderData<LoaderData>();

  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <aside className="p-6 md:h-full md:w-60 md:pr-0">
        <h3 className="text-xl font-normal lowercase">User</h3>
        <nav>
          <ul>
            <li>
              <NavigationLink to="/user" end>
                Profile & Settings
              </NavigationLink>
            </li>
            <li>
              <NavigationLink to="/user/account">
                Account & Security
              </NavigationLink>
            </li>
            <li>
              <NavigationLink to="/user/tags">Tags</NavigationLink>
            </li>
            <li>
              <NavigationLink to="/user/stats">Stats</NavigationLink>
            </li>
            <li>
              <NavigationLink to="/user/help">Help</NavigationLink>
            </li>
            <li>
              <NavigationLink to="/user/extras">Extras</NavigationLink>
            </li>
            {isAdmin && (
              <li>
                <NavigationLink to="/admin">Admin</NavigationLink>
              </li>
            )}
          </ul>
          <Form
            action="/logout"
            method="post"
            className="mt-6 inline-block items-center"
            onSubmit={useEventCallback({
              name: "log-out",
              data: { type: "submit" },
            })}
          >
            <button
              type="submit"
              className="w-full border border-button-border bg-button px-4 py-2 lowercase text-text hover:bg-button-hover active:bg-button-active"
            >
              Log out
            </button>
          </Form>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        <Outlet />
      </main>
    </div>
  );
}
