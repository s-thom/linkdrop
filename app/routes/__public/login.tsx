import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { verifyLogin } from "~/models/user.server";
import { createUserSession } from "~/session.server";
import { useEventCallback } from "~/util/analytics";
import { safeRedirect, validateEmail } from "~/utils";

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
    totp?: string;
  };
  extra?: {
    totp?: boolean;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const totp = formData.get("totp") ?? "";
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 },
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 },
    );
  }

  if (totp && typeof totp !== "string") {
    return json<ActionData>(
      { errors: { totp: "TOTP code is required" } },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 },
    );
  }

  const result = await verifyLogin(email, password, totp);
  if (!result.success) {
    switch (result.errorType) {
      case "password_incorrect":
        return json<ActionData>(
          { errors: { email: "Invalid email or password" } },
          { status: 400 },
        );
      case "requires_2fa":
        return json<ActionData>(
          { errors: {}, extra: { totp: true } },
          { status: 400 },
        );
      case "totp_incorrect":
        return json<ActionData>(
          { errors: { totp: "Incorrect code" }, extra: { totp: true } },
          { status: 400 },
        );
    }
  }

  return createUserSession({
    request,
    userId: result.user.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
};

export const meta: MetaFunction = () => [{ title: "Log In" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/links";
  const actionData = useActionData<ActionData>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const totpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
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
          name: "sign-in",
          data: { type: "submit" },
        })}
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium lowercase text-label"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              ref={emailRef}
              id="email"
              required
              autoFocus={true}
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={actionData?.errors?.email ? true : undefined}
              aria-describedby="email-error"
              className="w-full border border-input-border bg-input px-2 py-1 text-lg"
            />
            {actionData?.errors?.email && (
              <div className="pt-1 text-text-error" id="email-error">
                {actionData.errors.email}
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium lowercase text-label"
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
              className="w-full border border-input-border bg-input px-2 py-1 text-lg"
            />
            {actionData?.errors?.password && (
              <div className="pt-1 text-text-error" id="password-error">
                {actionData.errors.password}
              </div>
            )}
          </div>
        </div>

        {actionData?.extra?.totp && (
          <div>
            <label
              htmlFor="totp"
              className="block text-sm font-medium lowercase text-label"
            >
              Authenticator Code
            </label>
            <div className="mt-1">
              <input
                id="totp"
                ref={totpRef}
                name="totp"
                type="text"
                autoFocus={true}
                autoComplete="one-time-code"
                aria-invalid={actionData?.errors?.totp ? true : undefined}
                aria-describedby="totp-error"
                className="w-full border border-input-border bg-input px-2 py-1 text-lg"
              />
              {actionData?.errors?.totp && (
                <div className="pt-1 text-text-error" id="totp-error">
                  {actionData.errors.totp}
                </div>
              )}
            </div>
          </div>
        )}

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          className="w-full border border-button-border bg-button px-4 py-2 lowercase text-text hover:bg-button-hover active:bg-button-active"
        >
          Log in
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 border-input-border text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm lowercase text-label"
            >
              Remember me
            </label>
          </div>
        </div>
      </Form>
    </div>
  );
}
