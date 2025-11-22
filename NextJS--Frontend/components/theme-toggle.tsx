"use client";

import { useTheme } from "@/components/theme-provider";

type ThemeToggleVariant = "default" | "compact";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="M5 5l1.5 1.5" />
      <path d="M17.5 17.5L19 19" />
      <path d="M3 12h2" />
      <path d="M19 12h2" />
      <path d="M5 19l1.5-1.5" />
      <path d="M17.5 6.5L19 5" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

interface ThemeToggleProps {
  variant?: ThemeToggleVariant;
}

export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "Light mode" : "Dark mode";
  const showLabel = variant === "default";
  const sizeClasses =
    variant === "compact"
      ? "px-3 py-1.5 text-[0.6rem]"
      : "px-4 py-2 text-xs";

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-full border border-white/20 ${sizeClasses} font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:border-white/40`}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-sm">
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </span>
      {showLabel && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
}
