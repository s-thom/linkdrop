import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllUsersSummary } from "~/models/admin.server";
import { getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  users: {
    id: string;
    email: string;
    createdAt: Date;
    isAdmin: boolean;
    mostRecentLinkCreatedAt: Date | undefined;
    numLinks: number;
    numTags: number;
    hasTotp: boolean;
  }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);

  if (!user || !user.isAdmin) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const users = await getAllUsersSummary();

  return json<LoaderData>({
    users: users.map((user) => ({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      isAdmin: user.isAdmin,
      mostRecentLinkCreatedAt: user.links[0]?.createdAt ?? undefined,
      numLinks: user._count.links,
      numTags: user._count.tags,
      hasTotp: user.totp?.active ?? false,
    })),
  });
};

export default function AdminUsersPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        <table className="border-spacing-1 border border-card-border bg-card">
          <thead>
            <tr>
              <th className="p-1 border border-card-border">Email</th>
              <th className="p-1 border border-card-border">Created (UTC)</th>
              <th className="p-1 border border-card-border">Number of links</th>
              <th className="p-1 border border-card-border">Number of tags</th>
              <th className="p-1 border border-card-border">
                Most recent link
              </th>
              <th className="p-1 border border-card-border">TOTP Setup</th>
              <th className="p-1 border border-card-border">Is Admin</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <tr key={user.id} className="hover:bg-button-active">
                <td className="p-1 border border-card-border">{user.email}</td>
                <td className="p-1 border border-card-border">
                  <time dateTime={user.createdAt} title={user.createdAt}>
                    {new Date(user.createdAt).toLocaleDateString("en-NZ")}
                  </time>
                </td>
                <td className="p-1 border border-card-border">
                  {user.numLinks}
                </td>
                <td className="p-1 border border-card-border">
                  {user.numTags}
                </td>
                <td className="p-1 border border-card-border">
                  <time
                    dateTime={user.mostRecentLinkCreatedAt}
                    title={user.mostRecentLinkCreatedAt}
                  >
                    {user.mostRecentLinkCreatedAt
                      ? new Date(
                          user.mostRecentLinkCreatedAt,
                        ).toLocaleDateString("en-NZ")
                      : ""}
                  </time>
                </td>
                <td className="p-1 border border-card-border">
                  <input
                    type="checkbox"
                    name={`${user.id}-totp`}
                    readOnly
                    checked={user.hasTotp}
                  />
                </td>
                <td className="p-1 border border-card-border">
                  <input
                    type="checkbox"
                    name={`${user.id}-admin`}
                    readOnly
                    checked={user.isAdmin}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
