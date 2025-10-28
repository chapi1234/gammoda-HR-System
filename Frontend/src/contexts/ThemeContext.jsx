// import { createContext, useContext, useEffect, useState } from 'react';

// const ThemeContext = createContext();

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) { 
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };

// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState(() => {
//     const saved = localStorage.getItem('theme');
//     return saved || 'system';
//   });

//   const [colorScheme, setColorScheme] = useState(() => {
//     const saved = localStorage.getItem('colorScheme');
//     return saved || 'blue';
//   });

//   useEffect(() => {
//     const root = document.documentElement;
    
//     const applyTheme = () => {
//       // Remove existing theme classes
//       root.classList.remove('dark');
      
//       if (theme === 'dark') {
//         root.classList.add('dark');
//         console.log('✅ Applied dark theme - classList contains dark:', root.classList.contains('dark'));
//       } else if (theme === 'light') {
//         // Light theme is default, no class needed
//         console.log('✅ Applied light theme - classList contains dark:', root.classList.contains('dark'));
//       } else {
//         // System theme
//         const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//         if (mediaQuery.matches) {
//           root.classList.add('dark');
//           console.log('✅ Applied system dark theme - classList contains dark:', root.classList.contains('dark'));
//         } else {
//           console.log('✅ Applied system light theme - classList contains dark:', root.classList.contains('dark'));
//         }
//       }

//       // Force a repaint by toggling a CSS property
//       document.body.style.display = 'none';
//       document.body.offsetHeight; // Trigger reflow
//       document.body.style.display = '';
//     };

//     applyTheme();

//     // Listen for system theme changes when theme is set to 'system'
//     if (theme === 'system') {
//       const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//       const handleChange = () => applyTheme();
//       mediaQuery.addEventListener('change', handleChange);
      
//       return () => mediaQuery.removeEventListener('change', handleChange);
//     }
//   }, [theme]);

//   useEffect(() => {
//     // Apply color scheme and other settings
//     document.documentElement.setAttribute('data-color-scheme', colorScheme);
    
//     // Apply saved settings from localStorage
//     const savedSettings = localStorage.getItem('userSettings');
//     if (savedSettings) {
//       const parsedSettings = JSON.parse(savedSettings);
//       document.documentElement.setAttribute('data-font-size', parsedSettings.fontSize || 'medium');
//       document.documentElement.setAttribute('data-compact-mode', parsedSettings.compactMode || 'false');
//     } else {
//       document.documentElement.setAttribute('data-font-size', 'medium');
//       document.documentElement.setAttribute('data-compact-mode', 'false');
//     }
    
//     // Save to localStorage
//     localStorage.setItem('theme', theme);
//     localStorage.setItem('colorScheme', colorScheme);
//   }, [theme, colorScheme]);

//   const value = {
//     theme,
//     setTheme,
//     colorScheme,
//     setColorScheme
//   };

//   return (
//     <ThemeContext.Provider value={value}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

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
