import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import {
  deleteUserByEmail,
  getUser2faMethods,
  getUserById,
  verifyLogin,
} from "~/models/user.server";
import { logout, requireUserId } from "~/session.server";

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
    password?: string;
    totp?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = (await getUserById(userId))!;

  const formData = await request.formData();
  const password = formData.get("password");
  const totp = formData.get("totp") ?? "";

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

  const result = await verifyLogin(user.email, password, totp);
  if (result.success) {
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

  await deleteUserByEmail(user.email);

  return logout(request);
};

export default function Join() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  const passwordRef = useRef<HTMLInputElement>(null);
  const totpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.totp) {
      totpRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="mx-auto w-full max-w-md px-8">
      <Form method="delete" className="space-y-6" noValidate>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium lowercase text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="current-password"
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
          Delete account
        </button>
      </Form>
    </div>
  );
}
