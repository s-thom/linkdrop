import { useEffect, useState } from "react";
import { NavigationLink } from "./NavigationLink";

export interface PublicNavProps {
  allowSignUp: boolean;
}

export function PublicNav({ allowSignUp }: PublicNavProps) {
  const [pathname, setPathname] = useState("/");

  useEffect(() => {
    setPathname(window.location.pathname);
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const isOnLogin = pathname === "/login";
  const showLogin = !isOnLogin || (isOnLogin && allowSignUp);

  return (
    <>
      {allowSignUp && <NavigationLink to="/join">Sign up</NavigationLink>}
      {showLogin && <NavigationLink to="/login">Log In</NavigationLink>}
    </>
  );
}
