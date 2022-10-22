import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { FormErrors } from "~/components/LinkForm";
import LinkForm from "~/components/LinkForm";
import { deleteLink, editLink, getSingleLink } from "~/models/link.server";
import { requireUserId } from "~/session.server";
import { useEventCallback } from "~/util/analytics";
import { validateFormData } from "~/util/linkFormData.server";

type LoaderData = {
  link: NonNullable<Awaited<ReturnType<typeof getSingleLink>>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
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

  return json<LoaderData>({ link });
};

interface ActionData {
  errors?: FormErrors;
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

  // Process deletes
  if (
    request.method.toLowerCase() === "delete" ||
    formData.get("_method") === "delete"
  ) {
    await deleteLink({ id, userId });

    return redirect(`/links`);
  }

  const result = validateFormData(formData);
  if (result.status === "error") {
    return json<ActionData>({ errors: result.errors }, { status: 400 });
  }

  const values = result.values;

  const editedLink = await editLink({
    id,
    userId,
    url: values.url,
    description: values.description,
    tags: values.tags,
  });

  return redirect(`/links/${editedLink.id}`);
};

export default function LinkViewPage() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        <LinkForm
          i18n={{ submit: "Edit link" }}
          method="put"
          errors={actionData?.errors}
          initialValues={{
            url: data.link.url,
            description: data.link.description,
            tags: data.link.tags.map((t) => t.name),
          }}
          onSubmit={useEventCallback({
            name: "edit-link",
            data: { type: "submit" },
          })}
          currentLinkId={data.link.id}
        />
        <div className="mt-4 border border-red-200 bg-red-50 p-2">
          <Form
            method="delete"
            onSubmit={useEventCallback({
              name: "delete-link",
              data: { type: "submit" },
            })}
          >
            <h2 className="mb-2 text-xl font-normal lowercase text-red-800">
              Danger zone
            </h2>
            <input type="hidden" name="_method" value="delete" />
            <button
              type="submit"
              className="md:1/3 mt-2 w-full border border-red-400 py-2 px-4 lowercase text-red-800 hover:bg-red-200 active:bg-red-300 sm:w-1/2"
            >
              Delete link
            </button>
            <p className="text-sm font-normal lowercase text-red-800">
              This action can not be undone
            </p>
          </Form>
        </div>
      </main>
    </div>
  );
}
