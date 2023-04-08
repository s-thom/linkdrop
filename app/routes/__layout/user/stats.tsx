import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CommonLinks } from "~/components/user/CommonLinks";
import { CommonTags } from "~/components/user/CommonTags";
import { StatsHeading } from "~/components/user/StatsHeading";
import { getUserSummary } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { useEventCallback } from "~/util/analytics";

type LoaderData = {
  summary: Awaited<ReturnType<typeof getUserSummary>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const summary = await getUserSummary(userId);

  return json<LoaderData>({
    summary,
  });
};

export default function UserStatsPage() {
  const data = useLoaderData<LoaderData>();
  const { user, numLinks, commonTags, commonLinks } = data.summary;

  const sendClickGithubIssues = useEventCallback({
    name: "github-issues",
    data: { type: "click" },
  });

  return (
    <div className="flex flex-col gap-4">
      <StatsHeading user={user} numLinks={numLinks} />

      <CommonTags commonTags={commonTags} />

      <CommonLinks commonLinks={commonLinks} />

      <p className="text-sm">
        More info may come here later. If you have ideas, you can suggest them
        by{" "}
        <a
          href="https://github.com/s-thom/linkdrop/issues/new/choose"
          target="_blank"
          rel="noreferrer nofollow"
          className="text-nav-link underline decoration-1 hover:text-nav-link hover:no-underline active:text-nav-link-active"
          onClick={sendClickGithubIssues}
        >
          creating an issue in GitHub
        </a>
        .
      </p>
    </div>
  );
}
