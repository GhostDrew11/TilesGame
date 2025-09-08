import { Moon, Sun, SunDim } from "lucide-react";
import type { GameTheme, ThemeConfig } from "../types/types";

type ThemeSwitcherProps = {
  currentTheme: GameTheme;
  onThemeChange: (theme: GameTheme) => void;
  theme: ThemeConfig;
};

const ThemeSwitcher = ({
  currentTheme,
  onThemeChange,
  theme,
}: ThemeSwitcherProps) => {
  const getNextTheme = (): GameTheme => {
    switch (currentTheme) {
      case "default":
        return "dark";
      case "dark":
        return "colorful";
      case "colorful":
        return "default";
    }
  };

  const getThemeIcon = () => {
    switch (currentTheme) {
      case "default":
        return <SunDim className="theme-icon" />;
      case "dark":
        return <Moon className="theme-icon" />;
      case "colorful":
        return <Sun className="theme-icon" />;
    }
  };

  const handleThemeSwitch = () => {
    const nextTheme: GameTheme = getNextTheme();
    onThemeChange(nextTheme);
  };

  return (
    <button
      onClick={handleThemeSwitch}
      className="theme-switcher"
      style={{
        background: theme.cardBackground,
        color: theme.textColor,
        borderColor: theme.primaryColor,
      }}
      title={`Switch to ${getNextTheme()} theme`}
      aria-label={`Current: ${currentTheme}. Click to switch themes.`}
    >
      {getThemeIcon()}
    </button>
  );
};

export default ThemeSwitcher;
