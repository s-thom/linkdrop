import { Form } from "@remix-run/react";

function AddCredentialsForm() {
  return (
    <Form method="POST" action="/user/settings/wayback">
      <p className="mb-2">
        You can create credentials when logged in on the{" "}
        <a
          href="https://archive.org/account/s3.php"
          rel="noreferrer nofollow"
          className="text-nav-link underline decoration-1 hover:text-nav-link hover:no-underline active:text-nav-link-active"
        >
          Internet Archive website
        </a>
        .
      </p>

      <div className="grid mb-2 grid-cols-1 gap-2 md:grid-cols-2">
        <div>
          <label
            htmlFor="key"
            className="block text-sm font-medium lowercase text-label"
          >
            S3 Access Key
          </label>
          <div className="mt-1">
            <input
              id="key"
              required
              name="key"
              type="password"
              className="w-full border border-input-border bg-input px-2 py-1 text-lg"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="secret"
            className="block text-sm font-medium lowercase text-label"
          >
            S3 Secret
          </label>
          <div className="mt-1">
            <input
              id="secret"
              required
              name="secret"
              type="password"
              className="w-full border border-input-border bg-input px-2 py-1 text-lg"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full border border-button-border px-4 py-2 lowercase text-text hover:bg-button-hover active:bg-button-active"
      >
        Submit
      </button>
    </Form>
  );
}

function RemoveCredentialsForm() {
  return (
    <Form method="POST" action="/user/settings/wayback">
      <p className="mb-2">
        You have credentials saved for the Internet Archive. You can also
        invalidate your existing credentials when logged in on the{" "}
        <a
          href="https://archive.org/account/s3.php"
          rel="noreferrer nofollow"
          className="text-nav-link underline decoration-1 hover:text-nav-link hover:no-underline active:text-nav-link-active"
        >
          Internet Archive website
        </a>
        .
      </p>

      <button
        type="submit"
        className="w-full border border-button-border px-4 py-2 lowercase text-text hover:bg-button-hover active:bg-button-active"
      >
        Remove
      </button>
    </Form>
  );
}

export interface WaybackSettingsProps {
  isSet: boolean;
}

export function WaybackSettings({ isSet }: WaybackSettingsProps) {
  return (
    <div className="mb-2 max-w-3xl border border-card-border bg-card px-4 py-2">
      <h4 className="text-xl font-normal lowercase">Internet Archive</h4>
      <p className="mb-2 break-words text-text-diminished">
        Save links to the Internet Archive. Only newly saved links will be saved
        to the archive.
      </p>

      <RemoveCredentialsForm />
      <AddCredentialsForm />
    </div>
  );
}
