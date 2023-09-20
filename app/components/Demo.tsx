import { useCallback, useMemo, useState } from "react";
import { useEventCallback } from "~/util/analytics";
import { createLink, doMockSearch } from "~/util/mock";
import { inferTagStateFromName, useTagsInput } from "~/util/useTagsInput";
import type { LinkWithTags } from "./LinkDisplay";
import LinkDisplay from "./LinkDisplay";
import Tag from "./Tag";

const EXAMPLE_TAGS = ["what", "who", "why"];

const DEFAULT_LINK = createLink(
  "https://linkdrop.sthom.kiwi",
  "Try it out by using the tag search",
  ["try-it-out"],
);

const EXAMPLE_LINKS: LinkWithTags[] = [
  DEFAULT_LINK,
  createLink(
    "https://linkdrop.sthom.kiwi",
    "linkdrop is a website for storing links with tags, and then searching for them later.",
    ["linkdrop", "what"],
    10,
  ),
  createLink(
    "https://linkdrop.sthom.kiwi",
    "I wanted a quick way to search for things I've found on the internet.",
    ["linkdrop", "why"],
    20,
  ),
  createLink(
    "https://github.com/s-thom/the-index",
    "I had previously made something very similar, but I felt it was time to give the idea another attempt.",
    ["github", "the-index", "what", "why"],
    25,
  ),
  createLink(
    "https://sthom.kiwi",
    "Hi, I'm Stuart Thomson and I made this thing.",
    ["stuart-thomson", "who"],
    30,
  ),
  createLink(
    "https://zettelkasten.de/posts/overview/",
    "I've tried the Zettelkasten, but I found it quite overbearing to get into. I find linkdrop to be a lot more accessible and specialised, though I'm sure I'll need/want something as thorough as the Zettelkasten one day.",
    ["alternative", "why", "zettelkasten"],
    35,
  ),
  createLink(
    "https://fortelabs.co/blog/para/",
    "The PARA Method is geared towards project organisation, and has some really good ideas for organising information. I needed something for just the 'Archive' side, and just for links around the internet. A full-blown system just wasn't necessary.",
    ["alternative", "para", "why"],
    36,
  ),
  createLink(
    "https://github.com/s-thom/linkdrop",
    "This project is open source, and the source code is available on GitHub for anyone to contribute. That includes you!",
    ["github", "open-source", "what", "who"],
    45,
  ),
  createLink(
    "https://www.youtube.com/watch?v=oHg5SJYRHA0",
    "Shhh. Don't tell anyone.",
    ["secret"],
    50,
  ),
];

export interface DemoProps {
  direction?: "column" | "row";
}

export default function Demo({ direction = "row" }: DemoProps) {
  const [tagsValue, setTagsValue] = useState<string[]>([]);
  const addTag = useCallback((tag: string) => {
    setTagsValue((prev) => {
      if (!tag || prev.includes(tag)) {
        return prev;
      }
      return prev.concat(tag).sort();
    });
  }, []);
  const removeTag = useCallback((tag: string) => {
    setTagsValue((prev) => prev.filter((t) => t !== tag));
  }, []);
  const toggleTag = useCallback(
    (tag: string) => {
      tagsValue.includes(tag) ? removeTag(tag) : addTag(tag);
    },
    [addTag, removeTag, tagsValue],
  );

  const remainingCommonTags = useMemo(
    () => EXAMPLE_TAGS.filter((tag) => !tagsValue.includes(tag)) ?? [],
    [tagsValue],
  );

  const { input } = useTagsInput({
    addTag,
    allowNegative: true,
    allowPositive: true,
  });

  let links = doMockSearch(EXAMPLE_LINKS, tagsValue);
  if (links.length === 0 && tagsValue.length === 0) {
    links = [DEFAULT_LINK];
  }

  const activeTags = useMemo(() => {
    return tagsValue.map((tag) => tag.replace(/^[-+]/, ""));
  }, [tagsValue]);

  const sendDemoLinkClick = useEventCallback({
    name: "demo-link",
    data: { type: "click" },
  });

  return (
    <div className={`flex flex-col md:flex-${direction} md:justify-center`}>
      <aside className="p-6 md:h-full md:w-80 md:pr-0">
        <label
          htmlFor="_tag_entry"
          className="block text-sm font-medium lowercase text-label"
        >
          Tags
        </label>
        {tagsValue.length ? (
          <ul className="flex flex-wrap gap-2 py-2">
            {tagsValue.map((tag) => (
              <Tag
                key={tag}
                name={tag}
                state={inferTagStateFromName(tag) ?? "active"}
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag: ${tag}`}
              />
            ))}
          </ul>
        ) : (
          <p className="py-2 text-sm text-text-diminished">No tags entered</p>
        )}
        <div className="mt-1">{input}</div>
        {remainingCommonTags.length ? (
          <>
            <span className="block text-sm font-medium lowercase text-text-diminished">
              Some tags to get you started
            </span>
            <ul className="flex flex-wrap gap-2 py-2">
              {remainingCommonTags.map((tag) => (
                <Tag
                  key={tag}
                  name={tag}
                  state="inactive"
                  onClick={() => addTag(tag)}
                  aria-label={`Add tag: ${tag}`}
                />
              ))}
            </ul>
          </>
        ) : null}
      </aside>

      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        <ul>
          {links.map((link) => (
            <li key={link.id}>
              <LinkDisplay
                link={link}
                activeTags={activeTags}
                onLinkClick={sendDemoLinkClick}
                onTagClick={toggleTag}
              />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
