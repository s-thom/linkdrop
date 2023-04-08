import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Outlet } from "@remix-run/react";
import { NavigationLink } from "~/components/Header/NavigationLink";
import { requireUserId } from "~/session.server";
import { useEventCallback } from "~/util/analytics";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return json({});
};

export default function LinksIndexPage() {
  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <aside className="p-6 md:h-full md:w-60 md:pr-0">
        <h3 className="text-xl font-normal lowercase">User</h3>
        <nav>
          <ul>
            <li>
              <NavigationLink
                to="/user"
                className="lowercase text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
                end
              >
                Profile & Settings
              </NavigationLink>
            </li>
            <li>
              <NavigationLink
                to="/user/account"
                className="lowercase text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
              >
                Account
              </NavigationLink>
            </li>
            <li>
              <NavigationLink
                to="/user/stats"
                className="lowercase text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
              >
                Stats
              </NavigationLink>
            </li>
            <li>
              <NavigationLink
                to="/user/help"
                className="lowercase text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
              >
                Help
              </NavigationLink>
            </li>
            <li>
              <NavigationLink
                to="/user/extras"
                className="lowercase text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
              >
                Extras
              </NavigationLink>
            </li>
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
              className="w-full border border-black py-2 px-4 lowercase text-black hover:bg-neutral-200 active:bg-neutral-400"
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
