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
          "lowercase text-neutral-600 underline decoration-1 hover:text-neutral-600 hover:no-underline active:text-neutral-800",
          isActive && "italic text-neutral-800",
          className
        )
      }
      end={end}
    >
      {children}
    </NavLink>
  );
}
