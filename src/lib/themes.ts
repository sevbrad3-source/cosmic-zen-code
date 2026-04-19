export type ThemeName = "cinematic" | "granite" | "compact" | "hacker" | "lcars";

export interface Theme {
  name: string;
  id: ThemeName;
  cssClass: string;
}

export const themes: Theme[] = [
  { name: "Cinematic Command", id: "cinematic", cssClass: "theme-cinematic" },
  { name: "Dark Granite", id: "granite", cssClass: "theme-granite" },
  { name: "Ultra Compact", id: "compact", cssClass: "theme-compact" },
  { name: "Hacker Spy", id: "hacker", cssClass: "theme-hacker" },
  { name: "LCARS", id: "lcars", cssClass: "theme-lcars" },
];
