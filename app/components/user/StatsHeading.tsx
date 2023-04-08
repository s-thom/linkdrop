import type { User } from "@prisma/client";
import { Link } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";

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

export interface StatsHeadingProps {
  user: SerializeFrom<User>;
  numLinks: number;
}

export function StatsHeading({ user, numLinks }: StatsHeadingProps) {
  const { node: numLinksDescription } = NUM_LINKS_TEXT.find(
    (f) => f.lessThan >= numLinks
  )!;

  return (
    <>
      <h2 className="text-2xl font-normal lowercase">
        Stats for{" "}
        <a
          href={`mailto:${user.email}`}
          target="_blank"
          rel="noreferrer nofollow"
          className="text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800"
        >
          {user.email}
        </a>
      </h2>
      <div>
        <p>
          Since starting in{" "}
          <span>{new Date(user.createdAt).getFullYear()}</span>, you've saved{" "}
          <span>{numLinks}</span> links in linkdrop.
        </p>
        <p>{numLinksDescription}</p>
      </div>
    </>
  );
}
