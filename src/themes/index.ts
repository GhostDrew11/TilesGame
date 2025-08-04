import type { GameTheme, ThemeConfig } from "../types/types";
import defaultTheme from "./defaultTheme";
import { colorfulTheme, darkTheme } from "./otherThemes";

const themes: Record<GameTheme, ThemeConfig> = {
  default: defaultTheme,
  dark: darkTheme,
  colorful: colorfulTheme,
};

export type ThemeName = keyof typeof themes;
export type Theme = (typeof themes)[ThemeName];
export default themes;
