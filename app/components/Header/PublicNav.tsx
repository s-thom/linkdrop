import { useLocation } from "@remix-run/react";
import { NavigationLink } from "./NavigationLink";

export interface PublicNavProps {
  allowSignUp: boolean;
}

export function PublicNav({ allowSignUp }: PublicNavProps) {
  const { pathname } = useLocation();
  const isOnLogin = pathname === "/login";

  const showLogin = !isOnLogin || (isOnLogin && allowSignUp);

  return (
    <>
      {allowSignUp && <NavigationLink to="/join">Sign up</NavigationLink>}
      {showLogin && <NavigationLink to="/login">Log In</NavigationLink>}
    </>
  );
}
