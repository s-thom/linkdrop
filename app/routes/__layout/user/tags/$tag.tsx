import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { useCallback, useState } from "react";
import Tag from "~/components/Tag";
import { getLinksForTag } from "~/models/link.server";
import { getUserTag, renameUserTag } from "~/models/tag.server";
import { requireUserId } from "~/session.server";
import { useEventCallback } from "~/util/analytics";
import { decodeStringArray } from "~/util/stringArray";

interface LoaderData {
  tag: { id: string; name: string };
  numLinks: number;
  numLinksOnly: number;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.tag) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const userId = await requireUserId(request);
  const tag = await getUserTag({ userId, name: params.tag });
  if (!tag) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const links = await getLinksForTag({ userId, name: params.tag });

  const onlyTagLinks = links.filter((link) => link.tags.length === 1);

  return json<LoaderData>({
    tag,
    numLinks: links.length,
    numLinksOnly: onlyTagLinks.length,
  });
};

export interface FormErrors {
  name?: string;
  delete?: string;
}

interface ActionData {
  errors?: FormErrors;
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const name = params.tag;
  if (!name) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const tag = await getUserTag({ userId, name });
  if (!tag) {
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
    const links = await getLinksForTag({ userId, name });
    if (links.length > 0) {
      return json<ActionData>(
        { errors: { delete: `${links.length} links still using this tag` } },
        { status: 400 },
      );
    }

    return redirect(`/links`);
  }

  if (formData.get("_action") === "rename") {
    const renameValue = formData.get("name") ?? "";
    if (typeof renameValue !== "string") {
      return json<ActionData>(
        { errors: { name: "Name not valid" } },
        { status: 400 },
      );
    }
    const decodedTags = decodeStringArray(renameValue);
    if (decodedTags.length !== 1) {
      return json<ActionData>(
        { errors: { name: "Name not valid" } },
        { status: 400 },
      );
    }

    const newName = decodedTags[0];

    if (newName === name) {
      return json<ActionData>(
        { errors: { name: "Name not changed" } },
        { status: 400 },
      );
    }

    const existingTag = await getUserTag({ userId, name: newName });
    if (existingTag) {
      return json<ActionData>(
        { errors: { name: "Tag already exists with that name" } },
        { status: 400 },
      );
    }

    await renameUserTag({ userId, tagId: tag.id, newName });
    return redirect(`/user/tags/${encodeURI(newName)}`);
  }

  return json<ActionData>({ errors: {} }, { status: 400 });
};

export default function TagEditPage() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  const [nameValue, setNameValue] = useState(data.tag.name);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-normal lowercase">Edit {data.tag.name}</h2>

      <main className="flex-1 md:max-w-xl lg:max-w-2xl">
        <p>
          There are {data.numLinks} links with the tag{" "}
          <Tag name={`${data.tag.name}`} state="inactive" />. Making changes on
          this page will affect those links.
        </p>

        <Form
          method="put"
          onSubmit={useEventCallback({
            name: "edit-tag",
            data: { type: "submit" },
          })}
        >
          <h2 className="mb-2 text-xl font-normal lowercase">Rename</h2>
          <input type="hidden" name="_action" value="rename" />

          <div className="my-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium lowercase text-label"
            >
              Name
            </label>
            <input
              id="name"
              required
              autoComplete="off"
              autoFocus={true}
              name="name"
              type="name"
              aria-invalid={actionData?.errors?.name ? true : undefined}
              aria-describedby="name-error"
              className="w-full border border-input-border bg-input px-2 py-1 text-lg"
              value={nameValue}
              onChange={useCallback<React.ChangeEventHandler<HTMLInputElement>>(
                (event) => setNameValue(event.target.value),
                [],
              )}
            />
            {actionData?.errors?.name && (
              <div className="pt-1 text-red-700" id="name-error">
                {actionData?.errors.name}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full border border-button-border px-4 py-2 lowercase text-text hover:bg-button-hover active:bg-button-active"
          >
            Rename <Tag name={`${data.tag.name}`} state="inactive" />
          </button>
        </Form>

        <div className="mt-4 border border-card-error-border bg-card-error p-2">
          <Form
            method="delete"
            onSubmit={useEventCallback({
              name: "delete-tag",
              data: { type: "submit" },
            })}
          >
            <h2 className="mb-2 text-xl font-normal lowercase text-text-error">
              Danger zone
            </h2>
            <input type="hidden" name="_method" value="delete" />
            <button
              type="submit"
              className="md:1/3 mt-2 w-full border border-button-error-border px-4 py-2 lowercase text-text-error enabled:hover:bg-button-error-hover enabled:active:bg-button-error-active sm:w-1/2"
              disabled={data.numLinksOnly > 0}
            >
              Delete <Tag name={`${data.tag.name}`} state="negative" />
            </button>
            {data.numLinksOnly > 0 ? (
              <p className="text-sm font-normal lowercase text-text-error">
                There are {data.numLinksOnly} links that only use this tag. You
                must add other tags to these links before you can delete this
                tag.
              </p>
            ) : (
              <p className="text-sm font-normal lowercase text-text-error">
                This action can not be undone
              </p>
            )}
          </Form>
        </div>
      </main>
    </div>
  );
}
