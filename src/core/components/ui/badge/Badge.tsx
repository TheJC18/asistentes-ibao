import type { BadgeProps } from '../../types/index';

const Badge = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium";

  // Define size styles
  const sizeStyles = {
    sm: "text-theme-xs", // Smaller padding and font size
    md: "text-sm", // Default padding and font size
  };

  // Define color styles for variants
  const variants = {
    light: {
      primary: "bg-primary-light text-primary",
      success: "bg-success-light text-success",
      error: "bg-error-light text-error",
      warning: "bg-warning-light text-warning",
      info: "bg-info-light text-info",
      light: "bg-surface text-text-secondary",
      dark: "bg-text-primary text-text-on-primary",
    },
    solid: {
      primary: "bg-primary text-text-on-primary",
      success: "bg-success text-text-on-primary",
      error: "bg-error text-text-on-primary",
      warning: "bg-warning text-text-on-primary",
      info: "bg-info text-text-on-primary",
      light: "bg-surface text-text-secondary",
      dark: "bg-text-primary text-text-on-primary",
    },
  };

  // Get styles based on size and color variant
  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant][color];

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorStyles}`}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
