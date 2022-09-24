import Demo from "~/components/Demo";
import Tag from "~/components/Tag";

export default function LinksIndexPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-normal lowercase">Searching</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        <section className="mb-2 max-w-3xl border border-neutral-400 bg-white py-2 px-4">
          <h3 className="mb-2 block break-words text-xl font-normal lowercase">
            Tags
          </h3>
          <p className="mb-2 break-words">
            linkdrop uses tags to search for links. These tags can be as
            specific or generic as you'd like, and can be thought of as
            overlapping categories for the links.
          </p>
          <p className="mb-2 break-words">
            I'd recommend shorter and easy to remember words for your tags.
            linkdrop is meant to save you time, not cost it.
          </p>
          <p>
            <Tag name="matched" state="active" />{" "}
            <Tag name="not-matched" state="inactive" />
          </p>
        </section>

        <section className="mb-2 max-w-3xl border border-neutral-400 bg-white py-2 px-4">
          <h3 className="mb-2 block break-words text-xl font-normal lowercase">
            Search ordering
          </h3>
          <p className="mb-2 break-words">
            The way linkdrop orders links in the search results is consistent
            and not random.
          </p>
          <p className="mb-2 break-words">
            Links that match the highest number of tags in your search will
            appear first in the search results. If two links have the same
            number of matching tags, the most recently added link will be shown
            first.
          </p>
          <p className="mb-2 break-words">
            Links only need to match some of the tags in the search, so
            additional tools are provided to filter more specifically.
          </p>
        </section>

        <section className="mb-2 max-w-3xl border border-neutral-400 bg-white py-2 px-4">
          <h3 className="mb-2 block break-words text-xl font-normal lowercase">
            Including certain tags
          </h3>
          <p className="mb-2 break-words">
            By prefixing a tag with <code>+</code>, only links with that tag
            will appear in your search results.
          </p>
          <p className="mb-2 break-words">
            This can be used to form wider categories, allowing you to narrow
            down a wide range of topics quickly.
          </p>
          <p>
            <Tag name="+included" state="positive" />
          </p>
        </section>

        <section className="mb-2 max-w-3xl border border-neutral-400 bg-white py-2 px-4">
          <h3 className="mb-2 block break-words text-xl font-normal lowercase">
            Excluding certain tags
          </h3>
          <p className="mb-2 break-words">
            By prefixing a tag with <code>-</code>, only links without that tag
            will appear in your search results.
          </p>
          <p className="mb-2 break-words">
            These can be used in conjunction with the inclusive tags to enhance
            searching.
          </p>
          <p>
            <Tag name="-excluded" state="negative" />
          </p>
        </section>
      </div>

      <h3 className="mb-2 block break-words text-xl font-normal lowercase">
        Searching demo
      </h3>
      <div>
        <Demo direction="column" />
      </div>
    </div>
  );
}
