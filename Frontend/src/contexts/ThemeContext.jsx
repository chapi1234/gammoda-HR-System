import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });

  const [colorScheme, setColorScheme] = useState(() => {
    const saved = localStorage.getItem("colorScheme");
    return saved || "blue";
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      // Reset
      root.classList.remove("dark");

      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
        if (prefersDark.matches) {
          root.classList.add("dark");
        }
      }

      // Optional: force repaint to prevent flicker
      document.body.style.display = "none";
      document.body.offsetHeight; // trigger reflow
      document.body.style.display = "";
    };

    applyTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;

    // Apply color scheme
    root.setAttribute("data-color-scheme", colorScheme);

    // Load extra settings
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      root.setAttribute("data-font-size", parsed.fontSize || "medium");
      root.setAttribute("data-compact-mode", parsed.compactMode || "false");
    } else {
      root.setAttribute("data-font-size", "medium");
      root.setAttribute("data-compact-mode", "false");
    }

    // Save to localStorage
    localStorage.setItem("theme", theme);
    localStorage.setItem("colorScheme", colorScheme);
  }, [theme, colorScheme]);

  const value = {
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
