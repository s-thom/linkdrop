import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import {
  getUserById,
  updateUserPassword,
  verifyLogin,
} from "~/models/user.server";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return json({});
};

interface ActionData {
  errors: {
    currentPassword?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = (await getUserById(userId))!;

  const formData = await request.formData();
  const currentPassword = formData.get("currentPassword");
  const password = formData.get("password");

  if (typeof currentPassword !== "string") {
    return json<ActionData>(
      { errors: { currentPassword: "Password is required" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "New password is too short" } },
      { status: 400 }
    );
  }

  if (!(await verifyLogin(user.email, currentPassword))) {
    return json<ActionData>(
      { errors: { currentPassword: "Password is incorrect" } },
      { status: 400 }
    );
  }

  if (await verifyLogin(user.email, password)) {
    return json<ActionData>(
      {
        errors: {
          password:
            "New password must not be the same as your current password",
        },
      },
      { status: 400 }
    );
  }

  await updateUserPassword({ userId, password });

  return redirect("/user");
};

export default function Join() {
  const actionData = useActionData() as ActionData;

  const currentPasswordRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.currentPassword) {
      currentPasswordRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="mx-auto w-full max-w-md px-8">
      <Form method="post" className="space-y-6" noValidate>
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium lowercase text-gray-700"
          >
            Current Password
          </label>
          <div className="mt-1">
            <input
              id="currentPassword"
              ref={currentPasswordRef}
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              aria-invalid={
                actionData?.errors?.currentPassword ? true : undefined
              }
              aria-describedby="currentPassword-error"
              className="w-full border border-gray-500 px-2 py-1 text-lg"
            />
            {actionData?.errors?.currentPassword && (
              <div className="pt-1 text-red-700" id="currentPassword-error">
                {actionData.errors.currentPassword}
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium lowercase text-gray-700"
          >
            New Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              className="w-full border border-gray-500 px-2 py-1 text-lg"
            />
            {actionData?.errors?.password && (
              <div className="pt-1 text-red-700" id="password-error">
                {actionData.errors.password}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full border border-black py-2 px-4 lowercase text-black hover:bg-neutral-200 active:bg-neutral-400"
        >
          change password
        </button>
      </Form>
    </div>
  );
}
