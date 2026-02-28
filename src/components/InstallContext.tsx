import { createContext, useContext } from "react";
import type { InstallPromptInfo } from "~/lib/util/useInstallPrompt";
import { useInstallPrompt } from "~/lib/util/useInstallPrompt";

const InstallContext = createContext<InstallPromptInfo>({
  canPrompt: false,
  prompt: () => Promise.resolve(false),
});

export function useInstallContext() {
  return useContext(InstallContext);
}

export function InstallContextProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const value = useInstallPrompt();

  return (
    <InstallContext.Provider value={value}>{children}</InstallContext.Provider>
  );
}
