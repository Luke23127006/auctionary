import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { RotateCcw, X } from "lucide-react";

/**
 * Calculate toast duration based on message length
 * @param message - The message to display
 * @param customDuration - Optional custom duration in milliseconds
 * @returns Duration in milliseconds
 */
const calculateDuration = (
  message: string,
  customDuration?: number
): number => {
  if (customDuration !== undefined) {
    return customDuration;
  }

  // Base duration: 3 seconds (3000ms)
  // Add 50ms per character, with a minimum of 2s and maximum of 8s
  const baseMs = 1000;
  const msPerChar = 50;
  const calculated = baseMs + message.length * msPerChar;

  // Clamp between 2000ms (2s) and 8000ms (8s)
  return Math.min(Math.max(calculated, 2000), 8000);
};

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
  success: (message: string, duration?: number) =>
    toast.success(
      (t) => (
        <div className="flex items-center justify-between w-full gap-3">
          <span className="text-sm font-medium flex-1">{message}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
      {
        duration: calculateDuration(message, duration),
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
      }
    ),

  error: (message: string, duration?: number) =>
    toast.error(
      (t) => (
        <div className="flex items-center justify-between w-full gap-3">
          <span className="text-sm font-medium flex-1">{message}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
      {
        duration: calculateDuration(message, duration),
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
      }
    ),

  warning: (message: string, duration?: number) =>
    toast(
      (t) => (
        <div className="flex items-center justify-between w-full gap-3">
          <span className="text-sm font-medium flex-1">{message}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
      {
        duration: calculateDuration(message, duration),
        style: {
          ...baseStyle,
          borderLeft: "4px solid #f59e0b",
          boxShadow:
            "0 10px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(245,158,11,0.2)",
        },
        icon: "⚠️",
      }
    ),

  info: (message: string, duration?: number) =>
    toast(
      (t) => (
        <div className="flex items-center justify-between w-full gap-3">
          <span className="text-sm font-medium flex-1">{message}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
      {
        duration: calculateDuration(message, duration),
        style: {
          ...baseStyle,
          borderLeft: "4px solid #3b82f6",
          boxShadow:
            "0 10px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(59,130,246,0.2)",
        },
        icon: "ℹ️",
      }
    ),

  loading: (message: string, duration?: number) =>
    toast.loading(
      (t) => (
        <div className="flex items-center justify-between w-full gap-3">
          <span className="text-sm font-medium flex-1">{message}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
      {
        duration: calculateDuration(message, duration),
        style: {
          ...baseStyle,
          borderLeft: "4px solid #6366f1",
          boxShadow:
            "0 10px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(99,102,241,0.2)",
        },
      }
    ),

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) =>
    toast.promise(
      promise,
      {
        loading: (
          <div className="flex items-center justify-between w-full gap-3">
            <span className="text-sm font-medium flex-1">
              {messages.loading}
            </span>
          </div>
        ),
        success: (data) => {
          const successMsg =
            typeof messages.success === "function"
              ? messages.success(data)
              : messages.success;
          return (
            <div className="flex items-center justify-between w-full gap-3">
              <span className="text-sm font-medium flex-1">{successMsg}</span>
            </div>
          );
        },
        error: (error) => {
          const errorMsg =
            typeof messages.error === "function"
              ? messages.error(error)
              : messages.error;
          return (
            <div className="flex items-center justify-between w-full gap-3">
              <span className="text-sm font-medium flex-1">{errorMsg}</span>
            </div>
          );
        },
      },
      {
        style: baseStyle,
        success: {
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
        },
        error: {
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
        },
        loading: {
          style: {
            ...baseStyle,
            borderLeft: "4px solid #6366f1",
            boxShadow:
              "0 10px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(99,102,241,0.2)",
          },
        },
      }
    ),

  undo: (message: string, onUndo: () => void, duration?: number) =>
    toast(
      (t) => (
        <div className="flex items-center justify-between w-full gap-4 min-w-[240px]">
          <span className="text-sm font-medium">{message}</span>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                onUndo();
                toast.dismiss(t.id);
              }}
              className="h-7 px-3 text-xs border-white/10 hover:bg-white/10"
            >
              <RotateCcw className="mr-1.5 h-3 w-3" />
              Undo
            </Button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ),
      {
        duration: duration !== undefined ? duration : 4000,
        style: {
          ...baseStyle,
          borderLeft: "4px solid #3b82f6",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8)",
        },
      }
    ),
};
