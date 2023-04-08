import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { CommonLinks } from "~/components/user/CommonLinks";
import { CommonTags } from "~/components/user/CommonTags";
import { getUserSummary } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { useEventCallback } from "~/util/analytics";

const NUM_LINKS_TEXT: { lessThan: number; node: React.ReactNode }[] = [
  { lessThan: -1, node: "I have no idea how you did this." },
  {
    lessThan: 0,
    node: (
      <span>
        Let's{" "}
        <Link
          to={`/links/new`}
          className="text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
        >
          get started
        </Link>
        !
      </span>
    ),
  },
  { lessThan: 10, node: "Just getting started." },
  { lessThan: 20, node: "You're getting the hang of this." },
  { lessThan: 99, node: "Going strong." },
  { lessThan: 100, node: "100 links saved! This calls for a celebration 🎉" },
  { lessThan: 200, node: "I hope you've got a good categorisation system." },
  { lessThan: 999, node: "That's just a few." },
  { lessThan: 1000, node: "1000!" },
  { lessThan: 1100, node: "I'm running out of messages to put here." },
  { lessThan: 1336, node: "That's quite a lot!" },
  { lessThan: 1337, node: "🕶" },
  { lessThan: Infinity, node: "That's quite a lot!" },
];

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

export default function LinksIndexPage() {
  const data = useLoaderData<LoaderData>();
  const { user, numLinks, commonTags, commonLinks } = data.summary;

  const sendClickGithubIssues = useEventCallback({
    name: "github-issues",
    data: { type: "click" },
  });

  const { node: numLinksDescription } = NUM_LINKS_TEXT.find(
    (f) => f.lessThan >= numLinks
  )!;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-normal lowercase">
        Hi,{" "}
        <a
          href={`mailto:${user.email}`}
          target="_blank"
          rel="noreferrer nofollow"
          className="text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
        >
          {user.email}
        </a>
        .
      </h2>
      <div>
        <p>
          Since starting in{" "}
          <span>{new Date(user.createdAt).getFullYear()}</span>, you've saved{" "}
          <span>{numLinks}</span> links in linkdrop.
        </p>
        <p>{numLinksDescription}</p>
      </div>

      <CommonTags commonTags={commonTags} />

      <CommonLinks commonLinks={commonLinks} />

      <p className="text-sm">
        More info may come here later. If you have ideas, you can suggest them
        by{" "}
        <a
          href="https://github.com/s-thom/linkdrop/issues/new/choose"
          target="_blank"
          rel="noreferrer nofollow"
          className="text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
          onClick={sendClickGithubIssues}
        >
          creating an issue in GitHub
        </a>
        .
      </p>
    </div>
  );
}
