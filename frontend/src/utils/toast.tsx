import toast from "react-hot-toast";

const baseStyle = {
  background: "#15161b",
  color: "#d1d5db",
  border: "1px solid #333333",
  padding: "8px 10px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
  maxWidth: "400px",
};

export const notify = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        ...baseStyle,
        borderLeft: "4px solid #00c950",
        boxShadow:
          "0 10px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(0,201,80,0.2)",
      },
      iconTheme: {
        primary: "#00c950",
        secondary: "#15161b",
      },
    }),

  error: (message: string) =>
    toast.error(message, {
      style: {
        ...baseStyle,
        borderLeft: "4px solid #ef4444",
        boxShadow:
          "0 10px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(239,68,68,0.2)",
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#15161b",
      },
    }),
};
