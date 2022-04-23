import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { getUserCommonTags } from "~/models/tag.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

interface FormValues {
  tags: string[];
}

type Edit<T> = T extends Array<infer U>
  ? { add?: U[]; remove?: U[] }
  : T extends Object
  ? { [x in keyof T]?: Edit<T[x]> }
  : T;

function deduplicateArray<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function editArray<T>(tags: T[], changes: Edit<T[]>): T[] {
  return deduplicateArray(
    tags
      .filter((tag) => !changes.remove?.includes(tag))
      .concat(changes.add ?? [])
  );
}

function determineSearchParams(
  currentValue: FormValues,
  changes: Edit<FormValues>
): FormValues {
  return {
    tags: changes.tags
      ? editArray(currentValue.tags, changes.tags)
      : currentValue.tags,
  };
}

function formValueToQueryURL(value: FormValues) {
  const init = {
    tags: value.tags.sort().join(","),
  };

  const params = new URLSearchParams(init);
  return `?${params.toString()}`;
}

type LoaderData = {
  formValues: FormValues;
  commonTags: Awaited<ReturnType<typeof getUserCommonTags>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const tagsRaw = url.searchParams.get("tags");
  const tags = decodeURIComponent(tagsRaw ?? "")
    .split(",")
    .filter(Boolean);

  const formValues: FormValues = {
    tags,
  };

  const commonTags = await getUserCommonTags({ userId });
  return json<LoaderData>({ formValues, commonTags });
};

export default function NotesPage() {
  const data = useLoaderData<LoaderData>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to="/">linkdrop</Link>
          {" > "}
          <Link to=".">links</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <div className="flex h-full bg-white">
        <aside className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Note
          </Link>

          <hr />

          <Form replace>
            {data.formValues.tags.map((tag) => (
              <Link
                replace
                to={formValueToQueryURL(
                  determineSearchParams(data.formValues, {
                    tags: { remove: [tag] },
                  })
                )}
                key={tag}
              >
                {tag}
              </Link>
            ))}
            <hr />
            {data.commonTags.map((tag) => (
              <Link
                replace
                to={formValueToQueryURL(
                  determineSearchParams(data.formValues, {
                    tags: { add: [tag.name] },
                  })
                )}
                key={tag.id}
              >
                {tag.name}
              </Link>
            ))}
          </Form>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
