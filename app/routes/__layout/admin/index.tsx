import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { LinkDropText } from "~/components/LinkDropText";
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
      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        <h2 className="mb-6 text-6xl sm:text-8xl lg:text-9xl italic">
          <LinkDropText link="ad" drop="min" />
        </h2>
      </main>
    </div>
  );
}
