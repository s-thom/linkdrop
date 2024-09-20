import type { UserInvite } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { getAllUnusedInvites } from "~/models/admin.server";
import { createUserInvite } from "~/models/invites.server";
import { getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { useEventCallback } from "~/util/analytics";

type LoaderData = {
  invites: UserInvite[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);

  if (!user || !user.isAdmin) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const invites = await getAllUnusedInvites();

  return json<LoaderData>({
    invites,
  });
};

interface ActionData {
  errors?: {
    create?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);

  if (!user || !user.isAdmin) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  await createUserInvite({
    creator: null,
  });

  return json<ActionData>({});
};

export default function AdminInvitesPage() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl flex flex-col gap-4">
        <div>
          <Form
            method="post"
            onSubmit={useEventCallback({
              name: "create-invite-admin",
              data: { type: "submit" },
            })}
          >
            <button
              type="submit"
              className="w-full border border-button-border px-4 py-2 lowercase text-text hover:bg-button-hover active:bg-button-active"
            >
              Create invite
            </button>
            {actionData?.errors?.create && (
              <div className="pt-1 text-red-700" id="create-error">
                {actionData?.errors.create}
              </div>
            )}
          </Form>
        </div>
        <table className="border-spacing-1 border border-card-border bg-card">
          <thead>
            <tr>
              <th className="p-1 border border-card-border">ID</th>
              <th className="p-1 border border-card-border">Created (UTC)</th>
              <th className="p-1 border border-card-border">Created By</th>
            </tr>
          </thead>
          <tbody>
            {data.invites.map((invite) => (
              <tr key={invite.id} className="hover:bg-button-active">
                <td className="p-1 border border-card-border">
                  <Link
                    to={`/invites/${invite.id}`}
                    className="text-nav-link underline decoration-1 hover:text-nav-link hover:no-underline active:text-nav-link-active"
                  >
                    {invite.id}
                  </Link>
                </td>
                <td className="p-1 border border-card-border">
                  <time dateTime={invite.createdAt} title={invite.createdAt}>
                    {new Date(invite.createdAt).toLocaleDateString("en-NZ")}
                  </time>
                </td>
                <td className="p-1 border border-card-border">
                  {invite.creatorUserId ?? (
                    <span className="italic">admin</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
