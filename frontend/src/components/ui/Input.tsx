import "./Input.css";

export default function Input({
  type = "text",
  placeholder = "",
  value = "",
  onChange = () => {},
  disabled = false,
  name = "",
  required = false,
  className = "",
  ...rest
}: {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  className?: string;
  [key: string]: any; // Cho phép các props khác
}) {
  const inputClassName = `input-field ${className}`.trim();
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name={name}
      required={required}
      className={inputClassName}
      {...rest}
    />
  );
}
