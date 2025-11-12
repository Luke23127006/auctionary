import React from "react";
import "./Button.css";

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary";
}) {
  const buttonClassName = `
        btn 
        btn-${variant} 
        ${className}
    `.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClassName}
    >
      {children}
    </button>
  );
}
