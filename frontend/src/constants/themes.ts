export const themes = {
  tactical: {
    name: "Tactical Amber",
    "--bg-primary": "#0b0c10",
    "--bg-secondary": "#15161b",
    "--text-main": "#d1d5db",
    "--text-muted": "#9ca3af",
    "--accent-color": "#ff9900",
    "--accent-hover": "#e68a00",
    "--border-color": "#333333",
    "--font-display": "'Open Sans', sans-serif",
    "--radius": "8px",
  },
} as const;

export type ThemeKey = keyof typeof themes;

// luxury: {
//   name: "Luxury Gold",
//   "--bg-primary": "#050505",
//   "--bg-secondary": "#121212",
//   "--text-main": "#f3f4f6",
//   "--text-muted": "#6b7280",
//   "--accent-color": "#d4af37",
//   "--accent-hover": "#b5952f",
//   "--border-color": "#444444",
//   "--font-display": "'Open Sans', sans-serif",
//   "--radius": "4px",
// },
//   cyberpunk: {
//     name: "Neon City",
//     "--bg-primary": "#050510",
//     "--bg-secondary": "#0a0a16",
//     "--text-main": "#ccfbf1",
//     "--text-muted": "#5eead4",
//     "--accent-color": "#00ff9d",
//     "--accent-hover": "#00cc7d",
//     "--border-color": "#1a1a3a",
//     "--font-display": "sans-serif",
//     "--radius": "0px",
//   },
