import { Links, Meta, Scripts } from "@remix-run/react";
import { useEventCallback } from "~/util/analytics";
import { createLink } from "~/util/mock";
import type { HeaderProps } from "./Header";
import Header from "./Header";
import LinkDisplay from "./LinkDisplay";

const SPECIAL_TEXT: Record<number, NonNullable<HeaderProps["text"]>> = {
  404: { link: "40", drop: "4" },
};

const MOCK_LINK = createLink(
  "https://linkdrop.sthom.kiwi",
  "linkdrop's home page",
  ["linkdrop", "home"],
);

export interface BigErrorPageProps {
  status: number;
}

export function BigErrorPage({ status }: BigErrorPageProps) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-bg text-text">
        <div className="flex min-h-full flex-col justify-center sm:pb-16 sm:pt-8">
          <Header
            size="large"
            text={SPECIAL_TEXT[status] ?? { link: "err", drop: "or" }}
            mode="none"
          />

          <main>
            <div className="mx-auto w-full max-w-md px-8">
              <p className="mx-auto mb-4 max-w-lg text-center text-xl lowercase sm:max-w-3xl">
                {status === 404
                  ? "Page not found."
                  : `An unknown error occurred (${status}).`}
              </p>
              <LinkDisplay
                link={MOCK_LINK}
                onLinkClick={useEventCallback({
                  name: "error-page-link",
                  data: { type: "click", status },
                })}
              />
            </div>
          </main>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
