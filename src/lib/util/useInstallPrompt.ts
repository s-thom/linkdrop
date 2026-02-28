import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface InstallPromptInfo {
  canPrompt: boolean;
  prompt: () => Promise<boolean>;
}

/**
 * Note: This hook must be run on mount (i.e. at the root of the app), otherwise the event will get missed.
 */
export function useInstallPrompt() {
  const [canPrompt, setCanPrompt] = useState(false);
  const [event, setEvent] = useState<BeforeInstallPromptEvent>();

  const prompt = useCallback(async () => {
    if (!event) {
      throw new Error(
        'You must wait for the "beforeinstallprompt" event before calling this function',
      );
    }

    await event.prompt();
    const { outcome } = await event.userChoice;
    return outcome === "accepted";
  }, [event]);

  const onPrompt = useCallback((e: BeforeInstallPromptEvent) => {
    // Stop browser's default prompt
    e.preventDefault();

    setEvent(e);
    setCanPrompt(true);
  }, []);

  const onInstall = useCallback(() => {
    setCanPrompt(false);
  }, []);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt" as any, onPrompt);
    window.addEventListener("appinstalled" as any, onInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt" as any, onPrompt);
      window.removeEventListener("appinstalled" as any, onInstall);
    };
  });

  return {
    canPrompt,
    prompt,
  };
}
