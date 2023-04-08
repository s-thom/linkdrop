import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getUser2faMethods } from "~/models/user.server";
import { requireUserId } from "~/session.server";

interface LoaderData {
  mfa?: {
    totp: boolean;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const methods = await getUser2faMethods(userId);

  return json<LoaderData>({ mfa: methods });
};

export default function AccountIndexPage() {
  const data = useLoaderData<LoaderData>();

  const hasMfa = !!data.mfa?.totp;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-normal lowercase">Account settings</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        <section className="mb-2 max-w-3xl border border-card-border bg-card py-2 px-4">
          <h3 className="mb-2 block break-words text-xl font-normal lowercase">
            Change password
          </h3>
          <p className="mb-2 break-words">Need to change your password?</p>
          <Link
            to="/user/account/change-password"
            className="block w-full border border-button-border bg-button py-2 px-4 text-center lowercase text-text hover:bg-button-hover active:bg-button-active"
          >
            Change password
          </Link>
        </section>

        <section className="mb-2 max-w-3xl border border-card-border bg-card py-2 px-4">
          <h3 className="mb-2 block break-words text-xl font-normal lowercase">
            2 Factor Authentication
          </h3>
          {hasMfa ? (
            <p className="mb-2 break-words">
              Want to change your 2FA settings? You will need your current
              password to continue.
            </p>
          ) : (
            <p className="mb-2 break-words">
              Add 2FA to your account with a mobile authenticator app. You will
              need your current password to continue.
            </p>
          )}
          <Link
            to="/user/account/totp"
            className="block w-full border border-button-border bg-button py-2 px-4 text-center lowercase text-text hover:bg-button-hover active:bg-button-active"
          >
            {data.mfa?.totp ? "Remove authenticator" : "Set up authenticator"}
          </Link>
        </section>

        <section className="col-span-1 mb-2 max-w-3xl border border-card-error-border bg-card-error py-2 px-4 text-text-error">
          <h3 className="mb-2 block break-words text-xl font-normal lowercase">
            Delete account
          </h3>
          <p className="mb-2 break-words">
            Deleting your account is a permanent operation. All of your data
            will be lost, and can't be recovered at a later date.
          </p>
          <Link
            to="/user/account/delete"
            className="block w-full border border-button-error-border bg-button-error py-2 px-4 text-center lowercase text-text-error hover:bg-button-error-hover active:bg-button-error-active"
          >
            Delete account
          </Link>
        </section>
      </div>
    </div>
  );
}
