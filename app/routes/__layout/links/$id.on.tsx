import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSingleLink } from "~/models/link.server";
import { incrementUserLinkClicks } from "~/models/linkanalytics.server.ts";
import { requireUserId } from "~/session.server";

interface ClickParams {
  userId: string;
  linkId: string;
}

async function onClick({ userId, linkId }: ClickParams) {
  await incrementUserLinkClicks({ userId, linkId });
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const id = params.id;
  if (!id) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const link = await getSingleLink({ id });
  if (!link || link.userId !== userId) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const formData = await request.formData();
  const type = formData.get("type");

  switch (type) {
    case "click":
      await onClick({ userId, linkId: id });
      break;
    default:
      return json({ errors: [new Error("Unknown type")] }, { status: 400 });
  }

  return json({ ok: true }, { status: 200 });
};
