import type { getUserCommonTags } from "~/lib/models/tag.server";
import { useEventCallback } from "~/lib/util/analytics";
import Tag from "../Tag";

export interface CommonTagsProps {
  commonTags: Awaited<ReturnType<typeof getUserCommonTags>>;
}

export function CommonTags({ commonTags }: CommonTagsProps) {
  const sendClickCommonTag = useEventCallback({
    name: "common-tag",
    data: { type: "click" },
  });

  return (
    <section className="mb-2 max-w-3xl border border-card-border bg-card px-4 py-2">
      <h3 className="mb-2 block break-words text-xl font-normal lowercase">
        Most commonly used tags
      </h3>
      <p className="mb-2 break-words">
        Here's the tags you've used most often:
      </p>
      <ul className="flex flex-wrap gap-2">
        {commonTags.map((tag) => (
          <li key={tag.id}>
            <a
              href={`/links?tags=${encodeURIComponent(tag.name)}`}
              onClick={sendClickCommonTag}
            >
              <Tag
                component="span"
                name={`${tag.name} (${tag._count.links})`}
                className="cursor-pointer"
                state="inactive"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
