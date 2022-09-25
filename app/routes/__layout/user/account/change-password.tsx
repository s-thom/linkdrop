import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import {
  getUser2faMethods,
  getUserById,
  updateUserPassword,
  verifyLogin,
} from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { useEventCallback } from "~/util/analytics";

interface LoaderData {
  mfa?: {
    totp: boolean;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const methods = await getUser2faMethods(userId);

  return json<LoaderData>({ mfa: methods });
};

interface ActionData {
  errors: {
    currentPassword?: string;
    password?: string;
    totp?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = (await getUserById(userId))!;

  const formData = await request.formData();
  const currentPassword = formData.get("currentPassword");
  const password = formData.get("password");
  const totp = formData.get("totp") ?? "";

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

  if (totp && typeof totp !== "string") {
    return json<ActionData>(
      { errors: { totp: "TOTP code is required" } },
      { status: 400 }
    );
  }

  const passwordResult = await verifyLogin(user.email, currentPassword, totp);
  if (!passwordResult.success) {
    return json<ActionData>(
      { errors: { currentPassword: "Password is incorrect" } },
      { status: 400 }
    );
  }

  const samePasswordCheck = await verifyLogin(user.email, password, totp);
  if (samePasswordCheck.success) {
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

  return redirect("/user/account");
};

export default function Join() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const totpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.currentPassword) {
      currentPasswordRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.totp) {
      totpRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="mx-auto w-full max-w-md px-8">
      <Form
        method="post"
        className="space-y-6"
        noValidate
        onSubmit={useEventCallback({
          name: "change-password",
          data: { type: "submit" },
        })}
      >
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

        {data.mfa?.totp && (
          <div>
            <label
              htmlFor="totp"
              className="block text-sm font-medium lowercase text-gray-700"
            >
              Authenticator Code
            </label>
            <div className="mt-1">
              <input
                id="totp"
                ref={totpRef}
                name="totp"
                type="text"
                autoComplete="one-time-code"
                aria-invalid={actionData?.errors?.totp ? true : undefined}
                aria-describedby="totp-error"
                className="w-full border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.totp && (
                <div className="pt-1 text-red-700" id="totp-error">
                  {actionData.errors.totp}
                </div>
              )}
            </div>
          </div>
        )}

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
