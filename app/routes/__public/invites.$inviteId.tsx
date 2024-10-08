import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { LinkDropText } from "~/components/LinkDropText";
import { getUserInvite } from "~/models/invites.server";
import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUser } from "~/session.server";
import { useEventCallback } from "~/util/analytics";
import { useOptionalUser, validateEmail } from "~/utils";

export const loader: LoaderFunction = async ({ params }) => {
  const inviteId = params.inviteId;
  if (!inviteId) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const invite = await getUserInvite({ id: inviteId });
  if (!invite || invite.inviteeUserId) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json({});
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
    submit?: string;
  };
}

export const action: ActionFunction = async ({ request, params }) => {
  const user = await getUser(request);
  if (user) {
    return json<ActionData>(
      {
        errors: {
          submit:
            "You already have an account! Send this link to someone else so they can sign up.",
        },
      },
      { status: 400 },
    );
  }

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

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

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 },
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 },
    );
  }

  const newUser = await createUser(email, password, params.inviteId);

  return createUserSession({
    request,
    userId: newUser.id,
    remember: false,
    redirectTo: "/links",
  });
};

export const meta: MetaFunction = () => [{ title: "Sign Up" }];

export default function InvitePage() {
  const user = useOptionalUser();

  const actionData = useActionData<ActionData>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitErrorRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.submit) {
      submitErrorRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="mx-auto w-full max-w-md px-8">
      {user === undefined ? (
        <p className="my-2 lowercase">
          You've been invited to try <LinkDropText />, where you can save and
          search for the links you find around the internet.
        </p>
      ) : (
        <p className="my-2 text-text-error lowercase">
          You already have an account! Send this link to someone else so they
          can sign up.
        </p>
      )}
      <Form
        method="post"
        className="space-y-6"
        noValidate
        onSubmit={useEventCallback({
          name: "sign-up",
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
              readOnly={user !== undefined}
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
              autoComplete="new-password"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              className="w-full border border-input-border bg-input px-2 py-1 text-lg"
              readOnly={user !== undefined}
            />
            {actionData?.errors?.password && (
              <div className="pt-1 text-text-error" id="password-error">
                {actionData.errors.password}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full border border-button-border bg-button px-4 py-2 lowercase text-text enabled:hover:bg-button-hover enabled:active:bg-button-active"
          disabled={user !== undefined}
        >
          Sign up
        </button>
        {actionData?.errors?.submit && (
          <div className="pt-1 text-text-error" id="submit-error">
            {actionData.errors.submit}
          </div>
        )}
      </Form>
    </div>
  );
}
