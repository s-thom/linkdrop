import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import type { FormErrors } from "~/components/LinkForm";
import LinkForm from "~/components/LinkForm";
import { createLink } from "~/models/link.server";
import { requireUserId } from "~/session.server";
import { useEventCallback } from "~/util/analytics";
import { validateFormData } from "~/util/linkFormData.server";
import { decodeStringArray } from "~/util/stringArray";

type LoaderData = {
  url?: string;
  description?: string;
  tags?: string[];
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);

  const reqUrl = new URL(request.url);
  const url = reqUrl.searchParams.get("url") ?? undefined;
  const title = reqUrl.searchParams.get("title") ?? undefined;
  const description = reqUrl.searchParams.get("description") ?? undefined;
  const tagsRaw = reqUrl.searchParams.get("tags") ?? undefined;
  const tags = tagsRaw
    ? Array.from(new Set(decodeStringArray(tagsRaw)))
    : undefined;

  if (!url && description) {
    // Android doesn't send URLs, because its intents don't support it.
    const match = description.match(/^(?:([\S\s]*)\s+)?(https?:\/\/[^\s]+)$/);
    if (match) {
      const [, desc, link] = match;
      return json<LoaderData>({ url: link, description: desc ?? title, tags });
    }
  }

  return json<LoaderData>({ url, description, tags });
};

interface ActionData {
  errors?: FormErrors;
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const result = validateFormData(formData);
  if (result.status === "error") {
    return json<ActionData>({ errors: result.errors }, { status: 400 });
  }

  const values = result.values;

  await createLink({
    userId,
    url: values.url,
    description: values.description,
    tags: values.tags,
  });

  return redirect(`/links`);
};

export default function NewLinkPage() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const transition = useTransition();

  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        <LinkForm
          key={transition.state === "loading" ? "i" : "l"}
          i18n={{ submit: "Save link" }}
          method="post"
          errors={actionData?.errors}
          initialValues={{
            url: data.url ?? "",
            description: data.description ?? "",
            tags: data.tags ?? [],
          }}
          onSubmit={useEventCallback({
            name: "create-link",
            data: { type: "submit" },
          })}
        />
      </main>
    </div>
  );
}
