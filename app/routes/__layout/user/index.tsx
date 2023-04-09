import { useCallback, useState } from "react";
import Tag from "~/components/Tag";
import { useUser } from "~/utils";

interface ThemeOptionProps {
  id: string;
  name: string;
  description: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

function ThemeOption({
  id,
  name,
  description,
  checked,
  onChange,
}: ThemeOptionProps) {
  return (
    <label htmlFor={`theme_${id}`} data-theme={id}>
      <input
        type="radio"
        name="theme"
        value={id}
        id={`theme_${id}`}
        className="hidden"
        checked={checked}
        onChange={onChange}
      />
      <div className="mb-2 max-w-3xl cursor-pointer border border-card-border bg-card py-2 px-4 text-text">
        <p className="mb-2 block break-words text-xl font-normal text-link underline">
          {name}
        </p>
        <p className="mb-2">{description}</p>
        <div className="flex gap-2">
          <Tag name={id} state="inactive" />
          <Tag name={id} state="active" />
          <Tag name={`+${id}`} state="positive" />
          <Tag name={`-${id}`} state="negative" />
        </div>
      </div>
    </label>
  );
}

const THEME_KEY = "linkdrop-theme";

function ThemeSelection() {
  const [theme, setThemeState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(THEME_KEY) ?? "auto";
    }
    return "auto";
  });

  const setTheme = useCallback((newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    document.body.dataset.theme = newTheme;
  }, []);

  return (
    <div className="mb-2 max-w-3xl border border-card-border bg-card py-2 px-4">
      <h4 className="text-xl font-normal lowercase">Theme selection</h4>
      <p className="mb-2 break-words text-text-diminished">
        This preference is saved to this device and is not synced between
        devices.
      </p>
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        <ThemeOption
          id="auto"
          name="System"
          description="Automatically sync with system theme"
          checked={theme === "auto"}
          onChange={() => setTheme("auto")}
        />
        <ThemeOption
          id="light"
          name="Light"
          description="Always light theme"
          checked={theme === "light"}
          onChange={() => setTheme("light")}
        />
        <ThemeOption
          id="dark"
          name="Dark"
          description="Always dark theme"
          checked={theme === "dark"}
          onChange={() => setTheme("dark")}
        />
      </form>
    </div>
  );
}

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

      <ThemeSelection />
    </div>
  );
}
