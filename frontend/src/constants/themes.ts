export const themes = {
  tactical: {
    name: "Black Market",

    // --- 1. Backgrounds ---
    "--bg-primary": "#0b0c10",
    "--bg-secondary": "#15161b",
    "--bg-tertiary": "#1f2128", // Đã update từ #1f2026 sang #1f2128 theo Figma
    "--bg-input": "#15161b", // Mới
    "--bg-switch": "#333333", // Mới

    // --- 2. Typography ---
    "--text-main": "#d1d5db",
    "--text-muted": "#9ca3af",
    "--text-inverse": "#0b0c10",

    // --- 3. Actions & Accents ---
    "--accent-color": "#ff9900",
    "--accent-hover": "#ff8800", // Update sáng hơn theo Figma
    "--accent-light": "#ffaa33", // Mới
    "--accent-dark": "#cc7a00", // Mới
    "--accent-glow": "rgba(255, 153, 0, 0.15)",
    "--accent-ring": "#ff9900", // Update từ rgba sang hex solid theo Figma

    // --- 4. Borders & Lines ---
    "--border-color": "#333333",
    "--radius": "8px",

    // --- 5. Status Indicators ---
    "--status-success": "#00C950",
    "--status-error": "#ef4444",
    "--status-warning": "#ff9900",
    "--status-info": "#3b82f6",

    // --- 6. Charts (MỚI) ---
    "--chart-1": "#ff9900",
    "--chart-2": "#ffaa33",
    "--chart-3": "#cc7a00",
    "--chart-4": "#666666",
    "--chart-5": "#999999",

    // --- 7. Sidebar (MỚI) ---
    "--sidebar-bg": "#0b0c10",
    "--sidebar-fg": "#d1d5db",
    "--sidebar-primary": "#ff9900",
    "--sidebar-primary-fg": "#0b0c10",
    "--sidebar-accent": "#15161b",
    "--sidebar-accent-fg": "#d1d5db",
    "--sidebar-border": "#333333",
    "--sidebar-ring": "#ff9900",

    // --- 8. Component Specifics ---
    "--font-display": "'Open Sans', sans-serif",

    // Buttons (Cập nhật màu nền theo biến mới)
    "--btn-secondary-bg": "#1f2128", // Khớp với bg-tertiary
    "--btn-secondary-hover": "#2d3039", // Sáng hơn xíu
    "--btn-secondary-text": "#d1d5db",

    "--btn-destructive-bg": "#ef4444",
    "--btn-destructive-hover": "#dc2626",
    "--btn-destructive-text": "#ffffff",

    "--btn-ghost-hover-bg": "rgba(255, 153, 0, 0.1)",
  },
} as const;

export type ThemeKey = keyof typeof themes;
