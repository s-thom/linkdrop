import { useInstallContext } from "~/components/InstallContext";

export default function LinksIndexPage() {
  const { canPrompt, prompt } = useInstallContext();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-normal lowercase">Extras</h2>

      <section className="mb-2 max-w-3xl border border-neutral-200 bg-neutral-50 py-2 px-4">
        <h3 className="text-md mb-2 block break-words font-normal lowercase">
          Chrome Extension
        </h3>
        <p className="mb-2 break-words text-sm">
          linkdrop has a companion Chrome extension, which adds a button to save
          the current tab in the extensions menu near your search bar.
        </p>
        <p className="mb-2 break-words text-sm">
          Once installed, clicking the "Pin" icon in the extensions menu will
          keep it visible at all times.
        </p>
        <a
          href="https://chrome.google.com/webstore/detail/linkdrop/afcdppbpfiecoomopjpcfmmhcackmpef"
          target="_blank"
          rel="noreferrer nofollow"
          className="block w-full border border-neutral-300 py-2 px-4 text-center lowercase text-black hover:bg-neutral-100 active:bg-neutral-400"
        >
          Go to Chrome Web Store
        </a>
      </section>

      {canPrompt && (
        <section className="mb-2 max-w-3xl border border-neutral-200 bg-neutral-50 py-2 px-4">
          <h3 className="text-md mb-2 block break-words font-normal lowercase">
            Install
          </h3>
          <p className="mb-2 break-words text-sm">
            linkdrop can be installed to your device as a web application.
          </p>
          <p className="mb-2 break-words text-sm">
            This is most effective on mobile, as it allows you to share links to
            linkdrop from any app in order to save them.
          </p>
          <button
            type="button"
            className="w-full border border-neutral-300 py-2 px-4 lowercase text-black hover:bg-neutral-100 active:bg-neutral-400"
            onClick={() => prompt()}
          >
            Install
          </button>
        </section>
      )}
    </div>
  );
}
