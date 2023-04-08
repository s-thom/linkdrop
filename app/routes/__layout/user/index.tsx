import { useUser } from "~/utils";

export default function LinksIndexPage() {
  const user = useUser();

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
    </div>
  );
}
