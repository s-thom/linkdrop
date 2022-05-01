import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { authenticator } from "otplib";
import { useEffect, useMemo, useRef } from "react";
import {
  createUserTotp,
  decodeTotpSecret,
  deleteUserTotp,
  getUserTotp,
  setUserTotpActive,
} from "~/models/totp.server";
import {
  getUser2faMethods,
  getUserById,
  verifyLogin,
} from "~/models/user.server";
import { requireUserId } from "~/session.server";
import qr from "qrcode";
import { useUser } from "~/utils";

interface LoaderData {
  activation?: {
    secret: string;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const methods = await getUser2faMethods(userId);

  if (!methods.totp) {
    const totp = await getUserTotp(userId);

    let secret: string;
    if (totp?.secret) {
      secret = decodeTotpSecret(totp.secret);
    } else {
      secret = authenticator.generateSecret();
      await createUserTotp(userId, secret);
    }

    return json<LoaderData>({
      activation: {
        secret,
      },
    });
  }

  return json<LoaderData>({});
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

  if (totp && typeof totp !== "string") {
    return json<ActionData>(
      { errors: { totp: "TOTP code is required" } },
      { status: 400 }
    );
  }

  const result = await verifyLogin(user.email, password, totp);
  if (!result.success) {
    switch (result.errorType) {
      case "password_incorrect":
        return json<ActionData>(
          { errors: { password: "Invalid password" } },
          { status: 400 }
        );
      case "requires_2fa":
      case "totp_incorrect":
        return json<ActionData>(
          { errors: { totp: "Incorrect code" } },
          { status: 400 }
        );
    }
  }

  if (request.method.toLowerCase() === "delete") {
    await deleteUserTotp(userId);
  } else {
    await setUserTotpActive(userId);
  }

  return redirect("/user/account");
};

export default function SetUpTotpPage() {
  const user = useUser();
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

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const url = useMemo(() => {
    if (!data.activation?.secret) {
      return null;
    }
    return `otpauth://totp/${encodeURIComponent(
      `linkdrop (${user.email})`
    )}?secret=${data.activation.secret}`;
  }, [data.activation?.secret, user.email]);

  useEffect(() => {
    if (canvasRef.current && url) {
      qr.toCanvas(canvasRef.current, url);
    }
  }, [url]);

  return (
    <div className="mx-auto w-full max-w-md px-8">
      <Form
        method={data.activation ? "post" : "delete"}
        className="space-y-6"
        noValidate
      >
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium lowercase text-gray-700"
          >
            Current Password
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

        {data.activation && (
          <section className="mb-2 flex max-w-3xl flex-col items-center border border-neutral-400 bg-white py-2 px-4">
            <p>
              Use the following code to save your authenticator secret. Once
              enabled, you will not see this again.
            </p>

            <canvas className="my-2" ref={canvasRef} />

            <p className="text-sm text-neutral-500">
              If you aren't able to scan the code, use the value below.
            </p>
            <p className="select-all border py-1 px-2 text-center text-sm">
              {data.activation.secret}
            </p>
          </section>
        )}

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

        <button
          type="submit"
          className="w-full border border-black py-2 px-4 lowercase text-black hover:bg-neutral-200 active:bg-neutral-400"
        >
          {data.activation ? "Enable 2FA" : "Disable 2FA"}
        </button>
      </Form>
    </div>
  );
}
