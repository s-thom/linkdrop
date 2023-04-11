import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  deleteUserWaybackSettings,
  setUserWaybackSettings,
} from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { validateWaybackFormData } from "~/util/wayback.server";

interface ActionData {
  errors?: { key?: string; secret?: string };
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const id = params.id;
  if (!id) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const formData = await request.formData();

  // Process deletes
  if (
    request.method.toLowerCase() === "delete" ||
    formData.get("_method") === "delete"
  ) {
    await deleteUserWaybackSettings({ userId });

    return {};
  }

  const result = validateWaybackFormData(formData);
  if (result.status === "error") {
    return json<ActionData>({ errors: result.errors }, { status: 400 });
  }

  const { key, secret } = result.values;

  await setUserWaybackSettings({ userId, key, secret });

  return json<ActionData>({}, { status: 200 });
};
