const colorVariables = [
  "link",
  "link-visited",
  "link-active",
  "bg",
  "button",
  "button-hover",
  "button-active",
  "button-border",
  "button-error",
  "button-error-hover",
  "button-error-active",
  "button-error-border",
  "card",
  "card-border",
  "card-error",
  "card-error-border",
  "input",
  "input-border",
  "icon",
  "icon-hover",
  "label",
  "text",
  "text-error",
  "text-diminished",
  "nav-link",
  "nav-link-active",
  "tag",
  "tag-border",
  "tag-hover",
  "tag-text",
  "tag-active",
  "tag-active-border",
  "tag-active-hover",
  "tag-active-text",
  "tag-positive",
  "tag-positive-border",
  "tag-positive-hover",
  "tag-positive-text",
  "tag-negative",
  "tag-negative-border",
  "tag-negative-hover",
  "tag-negative-text",
];

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: colorVariables.reduce((acc, name) => {
        acc[name] = "var(--color-" + name + ")";
        return acc;
      }, {}),
      rotate: {
        heading: "5deg",
      },
    },
  },
  plugins: [],
};
