import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import LinkDisplay from "~/components/LinkDisplay";
import { getSingleLink } from "~/models/link.server";
import { useEventCallback } from "~/util/analytics";
import { useOptionalUser } from "~/utils";

type LoaderData = {
  link: NonNullable<Awaited<ReturnType<typeof getSingleLink>>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params.id;
  if (!id) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const link = await getSingleLink({ id });
  if (!link) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json<LoaderData>({ link });
};

export default function LinkViewPage() {
  const user = useOptionalUser();
  const data = useLoaderData<LoaderData>();

  const sendLinkClick = useEventCallback({
    name: "link",
    data: { type: "click" },
  });

  return (
    <div className="mx-auto mt-4 w-full max-w-md px-8 md:max-w-lg">
      <LinkDisplay
        link={data.link}
        canEdit={user?.id === data.link.userId}
        onLinkClick={sendLinkClick}
      />
    </div>
  );
}
