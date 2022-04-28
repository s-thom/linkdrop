import { createContext, useContext } from "react";
import type { InstallPromptInfo } from "~/util/useInstallPrompt";
import { useInstallPrompt } from "~/util/useInstallPrompt";

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
