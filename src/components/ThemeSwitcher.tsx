import type { GameTheme, ThemeConfig } from "../types/types";

type ThemeSwitcherProps = {
    currentTheme: GameTheme;
    onThemeChange: (theme: GameTheme) => void;
    theme: ThemeConfig;
}

const ThemeSwitcher = ({currentTheme, onThemeChange, theme}: ThemeSwitcherProps) => {
    return ()
}

export default ThemeSwitcher;