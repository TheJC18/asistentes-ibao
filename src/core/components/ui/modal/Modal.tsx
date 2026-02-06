import { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  titleIcon?: any;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  showCloseButton?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export default function Modal({
  open,
  onClose,
  title,
  titleIcon,
  children,
  maxWidth = "md",
  showCloseButton = true,
}: ModalProps) {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700 my-8 max-h-[calc(100vh-4rem)] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            className="absolute top-4 right-4 z-10 p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <FontAwesomeIcon icon={["fas", "times"]} className="text-lg" />
          </button>
        )}

        {/* Header */}
        {title && (
          <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-center gap-3">
              {titleIcon && (
                <FontAwesomeIcon
                  icon={titleIcon}
                  className="text-blue-600 dark:text-blue-400 text-2xl"
                />
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-6 sm:px-8 py-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
