import type React from "react";
import { Link } from "react-router";
import type { DropdownItemProps } from '../../types/index';

const DropdownItem = ({
  tag = "button",
  to,
  onClick,
  onItemClick,
  baseClassName = "block w-full text-left px-4 py-2 text-theme-sm font-medium rounded-lg text-text-primary hover:bg-surface hover:text-text-primary dark:hover:bg-white/5 dark:text-text-primary",
  className = "",
  children,
}: DropdownItemProps) => {
  const combinedClasses = `${baseClassName} ${className}`.trim();

  const handleClick = (event: React.MouseEvent) => {
    if (tag === "button") {
      event.preventDefault();
    }
    if (onClick) onClick();
    if (onItemClick) onItemClick();
  };

  if (tag === "a" && to) {
    return (
      <Link to={to} className={combinedClasses} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={handleClick} className={combinedClasses}>
      {children}
    </button>
  );
};

export default DropdownItem;