"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Restore theme on load
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDark(isDark);
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex items-center justify-center w-9 h-9 rounded-full
                 border border-[var(--border)]
                 hover:bg-[var(--card)]
                 transition"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
