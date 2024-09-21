import { Goose } from "~/components/Goose";
import { useInstallContext } from "~/components/InstallContext";
import { useEventCallback } from "~/util/analytics";

export default function UserExtrasPage() {
  const { canPrompt, prompt } = useInstallContext();
  const sendInstallTracking = useEventCallback({
    name: "install-pwa",
    data: { type: "click" },
  });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-normal lowercase">Extensions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        <section className="mb-2 max-w-3xl border border-card-border bg-card px-4 py-2">
          <h3 className="mb-2 block break-words text-xl font-normal lowercase">
            Firefox Extension
          </h3>
          <p className="mb-2 break-words">
            linkdrop has a companion Firefox extension, which adds a button to
            save the current tab in the extensions menu near your search bar.
          </p>
          <p className="mb-2 break-words">
            Once installed, open the Extensions menu and pin the extension to
            your toolbar for it to be visible at all times.
          </p>
          <a
            href="https://addons.mozilla.org/firefox/addon/linkdrop/"
            target="_blank"
            rel="noreferrer nofollow"
            className="block w-full border border-button-border px-4 py-2 text-center lowercase text-text hover:bg-button-hover active:bg-button-active"
            onClick={useEventCallback({
              name: "open-firefox-addons",
              data: { type: "click" },
            })}
          >
            Go to Firefox add-ons
          </a>
        </section>

        <section className="mb-2 max-w-3xl border border-card-border bg-card px-4 py-2">
          <h3 className="mb-2 block break-words text-xl font-normal lowercase">
            Chrome Extension
          </h3>
          <p className="mb-2 break-words">
            linkdrop has a companion Chrome extension, which adds a button to
            save the current tab in the extensions menu near your search bar.
          </p>
          <p className="mb-2 break-words">
            Once installed, open the Extensions menu and pin the extension to
            your toolbar for it to be visible at all times.
          </p>
          <a
            href="https://chrome.google.com/webstore/detail/linkdrop/afcdppbpfiecoomopjpcfmmhcackmpef"
            target="_blank"
            rel="noreferrer nofollow"
            className="block w-full border border-button-border px-4 py-2 text-center lowercase text-text hover:bg-button-hover active:bg-button-active"
            onClick={useEventCallback({
              name: "open-chrome-store",
              data: { type: "click" },
            })}
          >
            Go to Chrome Web Store
          </a>
        </section>
      </div>

      {canPrompt && (
        <>
          <h2 className="text-2xl font-normal lowercase">Install</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            <section className="mb-2 max-w-3xl border border-card-border bg-card px-4 py-2">
              <h3 className="mb-2 block break-words text-xl font-normal lowercase">
                Install
              </h3>
              <p className="mb-2 break-words">
                linkdrop can be installed to your device as if it were an app.
              </p>
              <p className="mb-2 break-words">
                This is most effective on mobile, as it allows you to share
                links directly to linkdrop from any app in order to save them.
              </p>
              <button
                type="button"
                className="w-full border border-button-border px-4 py-2 lowercase text-text hover:bg-button-hover active:bg-button-active"
                onClick={() => {
                  sendInstallTracking();
                  prompt();
                }}
              >
                Install
              </button>
            </section>
          </div>
        </>
      )}

      <p className="text-center text-sm">
        <Goose />
      </p>
    </div>
  );
}
