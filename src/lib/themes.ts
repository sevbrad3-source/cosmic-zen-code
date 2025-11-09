export type ThemeName = "granite" | "compact" | "hacker";

export interface Theme {
  name: string;
  id: ThemeName;
  cssClass: string;
}

export const themes: Theme[] = [
  {
    name: "Dark Granite",
    id: "granite",
    cssClass: "theme-granite",
  },
  {
    name: "Ultra Compact",
    id: "compact",
    cssClass: "theme-compact",
  },
  {
    name: "Hacker Spy",
    id: "hacker",
    cssClass: "theme-hacker",
  },
];
