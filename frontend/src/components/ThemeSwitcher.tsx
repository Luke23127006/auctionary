import React from "react";
import { useTheme } from "../hooks/useTheme";

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px",
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius)",
        display: "flex",
        gap: "10px",
        zIndex: 9999,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      {Object.entries(availableThemes).map(([key, value]) => (
        <button
          key={key}
          onClick={() => setTheme(key as any)}
          style={{
            backgroundColor:
              theme === key ? "var(--accent-color)" : "transparent",
            color: theme === key ? "#000" : "var(--text-main)",
            border: "1px solid var(--border-color)",
            cursor: "pointer",
            padding: "5px 10px",
            borderRadius: "var(--radius)",
            fontWeight: "bold",
          }}
        >
          {value.name}
        </button>
      ))}
    </div>
  );
};
