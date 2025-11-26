import React, { createContext, useEffect, useState } from "react";
import { themes, type ThemeKey } from "../constants/themes";

interface ThemeContextType {
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  availableThemes: typeof themes;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeKey>(() => {
    const savedTheme = localStorage.getItem("app-theme") as ThemeKey;
    return savedTheme && themes[savedTheme] ? savedTheme : "tactical";
  });

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = themes[theme];

    // Apply CSS variables
    Object.entries(currentTheme).forEach(([key, value]) => {
      if (key.startsWith("--")) {
        root.style.setProperty(key, value);
      }
    });

    localStorage.setItem("app-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
