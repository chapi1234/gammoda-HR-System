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
    return saved || "system";
  });

  const [colorScheme, setColorScheme] = useState(() => {
    const saved = localStorage.getItem("colorScheme");
    return saved || "blue";
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      // Remove existing theme classes
      root.classList.remove("dark");

      if (theme === "dark") {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
        console.log("Applied dark theme");
      } else if (theme === "light") {
        root.setAttribute("data-theme", "light");
        console.log("Applied light theme");
      } else {
        // System theme
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        if (mediaQuery.matches) {
          root.classList.add("dark");
          root.setAttribute("data-theme", "dark");
          console.log("Applied system dark theme");
        } else {
          root.setAttribute("data-theme", "light");
          console.log("Applied system light theme");
        }
      }
    };

    applyTheme();

    // Listen for system theme changes when theme is set to 'system'
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  useEffect(() => {
    // Apply color scheme
    document.documentElement.setAttribute("data-color-scheme", colorScheme);

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
