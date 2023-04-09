import Demo from "~/components/Demo";
import Tag from "~/components/Tag";

export default function LinksIndexPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-normal lowercase">Concepts</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        <section className="mb-2 max-w-3xl border border-card-border bg-card px-4 py-2">
          <h3 className="mb-2 block break-words text-xl font-normal lowercase">
            Links
          </h3>
          <p className="mb-2 break-words">
            linkdrop is all about saving links, and tries to make it as fast as
            possible to both save new ones and find old ones. Do one thing, do
            it well.
          </p>
          <p className="mb-2 break-words">
            You can also write a quick description of your links when you save
            or edit them. This might often be the title of the page, or
            something else to give you more context.
          </p>
        </section>

        <section className="mb-2 max-w-3xl border border-card-border bg-card px-4 py-2">
          <h3 className="mb-2 block break-words text-xl font-normal lowercase">
            Tags
          </h3>
          <p className="mb-2 break-words">
            When adding a new link, you can specify tags to associate with that
            link. These tags can be as specific or generic as you'd like, and
            can be thought of as overlapping categories for the links.
          </p>
          <p className="mb-2 break-words">
            I'd recommend shorter and easy to remember words for your tags.
            linkdrop is meant to save you time, not cost it.
          </p>
          <p>
            <Tag name="example" state="inactive" />
          </p>
        </section>
      </div>

      <h2 className="text-2xl font-normal lowercase">Searching</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        <section className="mb-2 max-w-3xl border border-card-border bg-card px-4 py-2">
          <h3 className="mb-2 block break-words text-xl font-normal lowercase">
            How search works
          </h3>
          <p className="mb-2 break-words">
            When you enter tags to search, linkdrop will find all links that
            match any of the tags you've specified and return them as a list.
          </p>
          <p className="mb-2 break-words">
            Any tags on the links that match the search will be highlighted, so
            you can see why a particular link was included.
          </p>
          <p>
            <Tag name="matched" state="active" />{" "}
            <Tag name="not-matched" state="inactive" />
          </p>
        </section>

        <section className="mb-2 max-w-3xl border border-card-border bg-card px-4 py-2">
          <h3 className="mb-2 block break-words text-xl font-normal lowercase">
            Search ordering
          </h3>
          <p className="mb-2 break-words">
            The way linkdrop orders links in the search results built to be
            predictable and consistent.
          </p>
          <p className="mb-2 break-words">
            Links that match the highest number of tags in your search will
            appear first in the search results. If two links have the same
            number of matching tags, the most recently added link will be shown
            first.
          </p>
        </section>

        <section className="mb-2 max-w-3xl border border-card-border bg-card px-4 py-2">
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

        <section className="mb-2 max-w-3xl border border-card-border bg-card px-4 py-2">
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
