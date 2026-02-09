import type React from "react";
import type { FC } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  autoComplete?: string;
  readOnly?: boolean;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  required = false,
  success = false,
  error = false,
  hint,
  autoComplete = "off",
  readOnly = false,
}) => {
  let inputClasses = ` h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-text-tertiary focus:outline-hidden focus:ring-3 bg-background text-text-primary ${className}`;

  if (disabled) {
    inputClasses += ` text-text-disabled border-border opacity-40 bg-surface cursor-not-allowed`;
  } else if (error) {
    inputClasses += ` border-error focus:border-error focus:ring-error-light`;
  } else if (success) {
    inputClasses += ` border-success focus:border-success focus:ring-success-light`;
  } else {
    inputClasses += ` bg-transparent border-border focus:border-primary focus:ring-primary-light`;
  }

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        className={inputClasses}
        autoComplete={autoComplete}
      />

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error"
              : success
              ? "text-success"
              : "text-text-tertiary"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
