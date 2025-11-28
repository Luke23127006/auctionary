import React, {
  useRef,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";

interface InputOTPProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onComplete?: (value: string) => void;
  className?: string;
}

const InputOTP: React.FC<InputOTPProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  onComplete,
  className,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpDisplay = value.padEnd(length, " ").slice(0, length).split("");

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;

    const finalDigit = digit.length > 1 ? digit.slice(-1) : digit;
    if (finalDigit && !/^\d$/.test(finalDigit)) return;

    const newOtpArray = value.padEnd(length, " ").slice(0, length).split("");
    newOtpArray[index] = finalDigit || " ";
    const newOtpString = newOtpArray.join("");

    onChange(newOtpString);

    if (finalDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const trimmedString = newOtpString.trim();
    if (trimmedString.length === length) {
      onComplete?.(trimmedString);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtpArray = value.padEnd(length, " ").slice(0, length).split("");

      if (newOtpArray[index] !== " ") {
        newOtpArray[index] = " ";
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newOtpArray[index - 1] = " ";
      }
      onChange(newOtpArray.join(""));
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, length).split("");
    const newOtpArray = Array(length).fill(" ");

    digits.forEach((digit, index) => {
      if (index < length) {
        newOtpArray[index] = digit;
      }
    });

    const newOtpString = newOtpArray.join("");
    onChange(newOtpString);

    const nextEmptyIndex = newOtpArray.findIndex((digit) => digit === " ");
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    const trimmedString = newOtpString.trim();
    if (trimmedString.length === length) {
      onComplete?.(trimmedString);
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className={`flex gap-3 justify-center my-6 ${className || ""}`}>
      {otpDisplay.map((digit, index) => {
        const isFilled = digit.trim().length > 0;
        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit.trim()}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={disabled}
            className={`
              w-12 h-14 text-center text-2xl font-semibold
              border-2 rounded-[var(--radius)]
              transition-all duration-200 ease-in-out outline-none
              font-display
              ${
                isFilled
                  ? "border-[var(--text-main)] bg-[var(--bg-primary)]"
                  : "border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)]"
              }
              focus:border-[var(--accent-color)] focus:bg-[var(--bg-primary)] focus:shadow-[0_0_0_3px_var(--accent-glow)]
              disabled:bg-[var(--bg-secondary)] disabled:cursor-not-allowed disabled:opacity-60
            `}
            aria-label={`OTP digit ${index + 1}`}
          />
        );
      })}
    </div>
  );
};

export default InputOTP;
