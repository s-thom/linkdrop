import { NavigationLink } from "./NavigationLink";

export function UserNav() {
  return (
    <>
      <NavigationLink to="/links" end>
        Your links
      </NavigationLink>
      <NavigationLink to="/links/new" end>
        New link
      </NavigationLink>
      <NavigationLink to="/user">Settings</NavigationLink>
    </>
  );
}
