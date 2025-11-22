import { useEffect, useState } from "react";

const KEY = "inventory_theme_v1";

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(KEY) || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    try {
      localStorage.setItem(KEY, theme);
    } catch {}
  }, [theme]);

  return [theme, setTheme];
}
