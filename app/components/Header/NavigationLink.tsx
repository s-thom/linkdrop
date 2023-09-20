import { NavLink } from "@remix-run/react";
import clsx from "clsx";
import type { PropsWithChildren } from "react";

export interface NavigationLinkProps extends PropsWithChildren {
  to: string;
  className?: string;
  end?: boolean;
}

export function NavigationLink({
  to,
  className,
  end,
  children,
}: NavigationLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "lowercase text-nav-link underline decoration-1 hover:text-nav-link hover:no-underline active:text-nav-link-active",
          isActive && "italic text-nav-link-active hover:text-nav-link-active",
          className,
        )
      }
      end={end}
    >
      {children}
    </NavLink>
  );
}
