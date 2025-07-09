import defaultTheme from "./defaultTheme";
import { colorfulTheme, darkTheme } from "./otherThemes";

const themes = {
  default: defaultTheme,
  dark: darkTheme,
  colorful: colorfulTheme,
};

export type ThemeKey = keyof typeof themes;
export default themes;
