import { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  value,
  name,
  id,
  disabled = false,
  required = false,
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(value || defaultValue);

  // Sync state when value or defaultValue changes (for edit mode)
  useEffect(() => {
    setSelectedValue(value || defaultValue);
  }, [value, defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value); // Trigger parent handler
  };

  return (
    <select
      id={id}
      name={name}
      className={`h-11 w-full appearance-none rounded-lg border border-border bg-background px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-text-tertiary focus:border-primary focus:outline-hidden focus:ring-3 focus:ring-primary-light ${
        selectedValue
          ? "text-text-primary"
          : "text-text-tertiary"
      } ${className}`}
      value={selectedValue}
      onChange={handleChange}
      disabled={disabled}
      required={required}
    >
      {/* Placeholder option */}
      <option
        value=""
        disabled
        className="text-text-secondary bg-surface"
      >
        {placeholder}
      </option>
      {/* Map over options */}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-text-secondary bg-surface"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
