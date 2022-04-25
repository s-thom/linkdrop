import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import type { FormErrors } from "~/components/LinkForm";
import LinkForm from "~/components/LinkForm";
import { createLink } from "~/models/link.server";
import { requireUserId } from "~/session.server";
import { validateFormData } from "~/util/linkFormData.server";

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

  const link = await createLink({
    userId,
    url: values.url,
    description: values.description,
    tags: values.tags,
  });

  return redirect(`/links/${link.id}`);
};

export default function NewLinkPage() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <main className="flex-1 p-6 md:max-w-xl lg:max-w-2xl">
        <LinkForm
          i18n={{ submit: "Save link" }}
          method="post"
          errors={actionData?.errors}
          initialValues={{ url: "", description: "", tags: [] }}
        />
      </main>
    </div>
  );
}
