import { NavigationLink } from "./NavigationLink";

export function UserNav() {
  return (
    <>
      <NavigationLink to="/links">Your links</NavigationLink>
      <NavigationLink to="/links/new">New link</NavigationLink>
      <NavigationLink to="/user">Settings</NavigationLink>
    </>
  );
}
