import React, {
  useRef,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import "./OTPInput.css"; // Đảm bảo bạn đã import file CSS

interface OTPInputProps {
  length?: number;
  value: string; // value từ cha là nguồn chân lý duy nhất
  onChange: (value: string) => void;
  disabled?: boolean;
  onComplete?: (value: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  onComplete,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 1. KHÔNG DÙNG useState cho 'otp' nữa.
  // Thay vào đó, chúng ta tạo mảng 'otpDisplay' từ 'value' prop
  // để render. Dùng khoảng trắng (" ") làm ký tự đệm.
  const otpDisplay = value.padEnd(length, " ").slice(0, length).split("");

  // Handle input change
  const handleChange = (index: number, digit: string) => {
    if (disabled) return;

    // Chỉ cho phép 1 chữ số
    const finalDigit = digit.length > 1 ? digit.slice(-1) : digit;
    if (finalDigit && !/^\d$/.test(finalDigit)) return;

    // Tạo mảng mới từ 'value' prop
    const newOtpArray = value.padEnd(length, " ").slice(0, length).split("");
    newOtpArray[index] = finalDigit || " "; // Đặt số mới hoặc khoảng trắng
    const newOtpString = newOtpArray.join("");

    // 2. Báo cho cha (VerifyOTPPage) biết 'value' MỚI
    onChange(newOtpString);

    // Auto-focus next input
    if (finalDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all digits are filled
    const trimmedString = newOtpString.trim();
    if (trimmedString.length === length) {
      onComplete?.(trimmedString);
    }
  };

  // 3. SỬA LỖI BACKSPACE (Logic 1 lần nhấn mượt mà)
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtpArray = value.padEnd(length, " ").slice(0, length).split("");

      if (newOtpArray[index] !== " ") {
        // 1. Nếu ô hiện tại CÓ SỐ: Chỉ xóa nó (thành khoảng trắng)
        newOtpArray[index] = " ";
      } else if (index > 0) {
        // 2. Nếu ô hiện tại RỖNG: Di chuyển focus và xóa ô TRƯỚC ĐÓ
        inputRefs.current[index - 1]?.focus();
        newOtpArray[index - 1] = " ";
      }
      onChange(newOtpArray.join("")); // Báo cho cha biết
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste (cập nhật để dùng khoảng trắng)
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, length).split("");
    const newOtpArray = Array(length).fill(" "); // Khởi tạo bằng khoảng trắng

    digits.forEach((digit, index) => {
      if (index < length) {
        newOtpArray[index] = digit;
      }
    });

    const newOtpString = newOtpArray.join("");
    onChange(newOtpString); // Báo cho cha biết

    // Logic focus
    const nextEmptyIndex = newOtpArray.findIndex((digit) => digit === " ");
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    const trimmedString = newOtpString.trim();
    if (trimmedString.length === length) {
      onComplete?.(trimmedString);
    }
  };

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // 4. KHÔNG CÒN 'useEffect' xung đột với [value, length] nữa

  return (
    <div className="otp-input-container">
      {/* 5. Dùng 'otpDisplay' (lấy từ prop) để render */}
      {otpDisplay.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit.trim()} // 6. Dùng trim() để hiển thị
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          className={`otp-input ${digit.trim() ? "filled" : ""} ${
            disabled ? "disabled" : ""
          }`}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
