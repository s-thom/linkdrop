import { ThemeSelector } from "~/components/user/settings/ThemeSelector";
import { useUser } from "~/utils";

export default function ProfileSettingsPage() {
  const user = useUser();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-normal lowercase">
        Hi,{" "}
        <a
          href={`mailto:${user.email}`}
          target="_blank"
          rel="noreferrer nofollow"
          className="text-nav-link underline decoration-1 hover:text-nav-link hover:no-underline active:text-nav-link-active"
        >
          {user.email}
        </a>
        .
      </h2>
      <h3 className="text-2xl font-normal lowercase">Settings</h3>

      <ThemeSelector />
    </div>
  );
}
