import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getAdminUserSummary } from "~/models/admin.server";
import { getUserCreatedInvites } from "~/models/invites.server";
import { getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  user: {
    id: string;
    email: string;
    createdAt: Date;
    isAdmin: boolean;
    mostRecentLinkCreatedAt: Date | undefined;
    numLinks: number;
    numTags: number;
    hasTotp: boolean;
    wasInvited: boolean;
    invitedBy: { id: string; email: string } | undefined;
  };
  invites: Awaited<ReturnType<typeof getUserCreatedInvites>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);

  if (!user || !user.isAdmin) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const id = params.userId;
  if (!id) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const userSummary = await getAdminUserSummary({ id });
  if (!userSummary) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const invites = await getUserCreatedInvites({ userId: id });

  return json<LoaderData>({
    user: {
      id: userSummary.id,
      email: userSummary.email,
      createdAt: userSummary.createdAt,
      isAdmin: userSummary.isAdmin,
      mostRecentLinkCreatedAt: userSummary.links[0]?.createdAt ?? undefined,
      numLinks: userSummary._count.links,
      numTags: userSummary._count.tags,
      hasTotp: userSummary.totp?.active ?? false,
      wasInvited: userSummary.invitedInvite !== null,
      invitedBy:
        userSummary.invitedInvite && userSummary.invitedInvite.creator
          ? {
              id: userSummary.invitedInvite.creator.id,
              email: userSummary.invitedInvite.creator.email,
            }
          : undefined,
    },
    invites,
  });
};

export default function AdminUserPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        <h2 className="mb-1 text-2xl font-normal lowercase">
          {data.user.email}
        </h2>
        <table className="border-spacing-1 border border-card-border bg-card">
          <thead>
            <tr>
              <th className="p-1 border border-card-border">Info</th>
              <th className="p-1 border border-card-border">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-button-active">
              <td className="p-1 border border-card-border">Created (UTC)</td>
              <td className="p-1 border border-card-border">
                <time
                  dateTime={data.user.createdAt}
                  title={data.user.createdAt}
                >
                  {new Date(data.user.createdAt).toLocaleDateString("en-NZ")}
                </time>
              </td>
            </tr>
            <tr className="hover:bg-button-active">
              <td className="p-1 border border-card-border">Number of links</td>
              <td className="p-1 border border-card-border">
                {data.user.numLinks}
              </td>
            </tr>
            <tr className="hover:bg-button-active">
              <td className="p-1 border border-card-border">Number of tags</td>
              <td className="p-1 border border-card-border">
                {data.user.numTags}
              </td>
            </tr>
            <tr className="hover:bg-button-active">
              <td className="p-1 border border-card-border">
                Most recently created link (UTC)
              </td>
              <td className="p-1 border border-card-border">
                <time
                  dateTime={data.user.mostRecentLinkCreatedAt}
                  title={data.user.mostRecentLinkCreatedAt}
                >
                  {data.user.mostRecentLinkCreatedAt
                    ? new Date(
                        data.user.mostRecentLinkCreatedAt,
                      ).toLocaleDateString("en-NZ")
                    : ""}
                </time>
              </td>
            </tr>
            <tr className="hover:bg-button-active">
              <td className="p-1 border border-card-border">Invited by</td>
              <td className="p-1 border border-card-border">
                {data.user.wasInvited ? (
                  data.user.invitedBy ? (
                    <Link
                      to={`/admin/users/${data.user.invitedBy.id}`}
                      className="text-nav-link underline decoration-1 hover:text-nav-link hover:no-underline active:text-nav-link-active"
                    >
                      {data.user.invitedBy.email}
                    </Link>
                  ) : (
                    <span className="italic">admin</span>
                  )
                ) : (
                  <span className="italic">none</span>
                )}
              </td>
            </tr>
            <tr className="hover:bg-button-active">
              <td className="p-1 border border-card-border">Has setup TOTP</td>
              <td className="p-1 border border-card-border">
                <input
                  type="checkbox"
                  name={`${data.user.id}-totp`}
                  readOnly
                  checked={data.user.hasTotp}
                />
              </td>
            </tr>
            <tr className="hover:bg-button-active">
              <td className="p-1 border border-card-border">Is admin</td>
              <td className="p-1 border border-card-border">
                <input
                  type="checkbox"
                  name={`${data.user.id}-admin`}
                  readOnly
                  checked={data.user.isAdmin}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <h3 className="mt-2 mb-1 text-xl font-normal lowercase">Invites</h3>
        <table className="border-spacing-1 border border-card-border bg-card">
          <thead>
            <tr>
              <th className="p-1 border border-card-border">ID</th>
              <th className="p-1 border border-card-border">Created (UTC)</th>
              <th className="p-1 border border-card-border">Invitee</th>
              <th className="p-1 border border-card-border">Accepted (UTC)</th>
            </tr>
          </thead>
          <tbody>
            {data.invites.map((invite) => (
              <tr key={invite.id} className="hover:bg-button-active">
                <td className="p-1 border border-card-border">
                  {invite.invitee ? (
                    invite.id
                  ) : (
                    <Link
                      to={`/invites/${invite.id}`}
                      className="text-nav-link underline decoration-1 hover:text-nav-link hover:no-underline active:text-nav-link-active"
                    >
                      {invite.id}
                    </Link>
                  )}
                </td>
                <td className="p-1 border border-card-border">
                  <time dateTime={invite.createdAt} title={invite.createdAt}>
                    {new Date(invite.createdAt).toLocaleDateString("en-NZ")}
                  </time>
                </td>
                <td className="p-1 border border-card-border">
                  {invite.invitee ? (
                    <Link
                      to={`/admin/users/${invite.invitee.id}`}
                      className="text-nav-link underline decoration-1 hover:text-nav-link hover:no-underline active:text-nav-link-active"
                    >
                      {invite.invitee.email}
                    </Link>
                  ) : (
                    <span className="italic">admin</span>
                  )}
                </td>
                <td className="p-1 border border-card-border">
                  {invite.invitee ? (
                    <time
                      dateTime={invite.invitee.createdAt}
                      title={invite.invitee.createdAt}
                    >
                      {new Date(invite.invitee.createdAt).toLocaleDateString(
                        "en-NZ",
                      )}
                    </time>
                  ) : (
                    ""
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
