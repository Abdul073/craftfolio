"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function MultiTabThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("multitab-theme") as Theme;
      return savedTheme || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("multitab-light", "multitab-dark");
    root.classList.add(`multitab-${theme}`);
    localStorage.setItem("multitab-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useMultiTabTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useMultiTabTheme must be used within a MultiTabThemeProvider"
    );
  }
  return context;
}

export const getThemeClasses = (theme: any) => {
  return {
    textPrimary: theme.colors.text.primary,
    textSecondary: theme.colors.text.secondary,
    bgPrimary: theme.colors.background.primary,
    bgSecondary: theme.colors.background.secondary,
    gradientPrimary: theme.colors.gradients.primary,
    gradientHover: theme.colors.gradients.hover,
    gradientHeader: theme.colors.gradients.header,
    accent: theme.colors.accent,
    accentHover: theme.colors.primaryHover,
    muted: theme.colors.states.muted
  };
};
