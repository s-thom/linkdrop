import { Link } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import type { getUserCommonTags } from "~/models/tag.server";
import { useEventCallback } from "~/util/analytics";
import Tag from "../Tag";

export interface CommonTagsProps {
  commonTags: SerializeFrom<Awaited<ReturnType<typeof getUserCommonTags>>>;
}

export function CommonTags({ commonTags }: CommonTagsProps) {
  const sendClickCommonTag = useEventCallback({
    name: "common-tag",
    data: { type: "click" },
  });

  return (
    <section className="mb-2 max-w-3xl border border-card-border bg-card py-2 px-4">
      <h3 className="mb-2 block break-words text-xl font-normal lowercase">
        Most commonly used tags
      </h3>
      <p className="mb-2 break-words">
        Here's the tags you've used most often:
      </p>
      <ul className="flex flex-wrap gap-2">
        {commonTags.map((tag) => (
          <li key={tag.id}>
            <Link
              to={`/links?tags=${encodeURIComponent(tag.name)}`}
              onClick={sendClickCommonTag}
            >
              <Tag
                name={`${tag.name} (${tag._count.links})`}
                className="cursor-pointer"
                state="inactive"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
