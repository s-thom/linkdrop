import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { ThemeSelector } from "~/components/user/settings/ThemeSelector";
import { WaybackSettings } from "~/components/user/settings/WaybackSettings";
import { getUserWaybackSettings } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

type LoaderData = {
  wayback: { isSet: boolean };
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const waybackSettings = await getUserWaybackSettings({ userId });

  return json<LoaderData>({
    wayback: { isSet: !!waybackSettings },
  });
};

export default function ProfileSettingsPage() {
  const user = useUser();
  const data = useLoaderData<LoaderData>();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-normal lowercase">
        Hi,{" "}
        <a
          href={`mailto:${user.email}`}
          target="_blank"
          rel="noreferrer nofollow"
          className="text-nav-link underline decoration-1 hover:text-nav-link hover:no-underline active:text-nav-link-active"
        >
          {user.email}
        </a>
        .
      </h2>
      <h3 className="text-2xl font-normal lowercase">Settings</h3>

      <ThemeSelector />
      <WaybackSettings isSet={data.wayback.isSet} />
    </div>
  );
}
