import clsx from "clsx";
import { useEffect, useState, type PropsWithChildren } from "react";

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
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const check = () => {
      const pathname = window.location.pathname;
      setIsActive(end ? pathname === to : pathname.startsWith(to));
    };
    check();
    window.addEventListener("popstate", check);
    return () => window.removeEventListener("popstate", check);
  }, [to, end]);

  return (
    <a
      href={to}
      className={clsx(
        "lowercase text-nav-link underline decoration-1 hover:text-nav-link hover:no-underline active:text-nav-link-active",
        isActive && "italic text-nav-link-active hover:text-nav-link-active",
        className,
      )}
    >
      {children}
    </a>
  );
}
