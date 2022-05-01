import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const superuserSecret = formData.get("__");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (
    process.env.ALLOW_EMAIL_JOIN !== "true" &&
    superuserSecret !== process.env.SUPERUSER_SECRET
  ) {
    return json<ActionData>(
      { errors: { email: "Sign up is not enabled" } },
      { status: 400 }
    );
  }

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
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
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<ActionData>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="mx-auto w-full max-w-md px-8">
      <Form method="post" className="space-y-6" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium lowercase text-gray-700"
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
              className="w-full border border-gray-500 px-2 py-1 text-lg"
            />
            {actionData?.errors?.email && (
              <div className="pt-1 text-red-700" id="email-error">
                {actionData.errors.email}
              </div>
            )}
          </div>
        </div>

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

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <input type="hidden" name="__" value="" />
        <button
          type="submit"
          className="w-full border border-black py-2 px-4 lowercase text-black hover:bg-neutral-200 active:bg-neutral-400"
        >
          sign up
        </button>
      </Form>
    </div>
  );
}
