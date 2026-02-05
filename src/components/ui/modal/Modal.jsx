import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Modal Component - Componente modal reutilizable
 * 
 * @param {boolean} isOpen - Controla si el modal está abierto
 * @param {function} onClose - Función para cerrar el modal
 * @param {string} title - Título del modal
 * @param {React.ReactNode} children - Contenido del modal
 * @param {string} size - Tamaño del modal: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {boolean} showCloseButton - Mostrar botón de cerrar (default: true)
 * @param {boolean} closeOnBackdropClick - Cerrar al hacer click fuera (default: true)
 * @param {boolean} closeOnEscape - Cerrar al presionar ESC (default: true)
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  icon,
}) {
  const modalRef = useRef(null);

  // Bloquear scroll del fondo
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, closeOnEscape]);

  // Cerrar al hacer click fuera
  const handleBackdrop = (e) => {
    if (closeOnBackdropClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Tamaños disponibles
  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onMouseDown={handleBackdrop}
    >
      <div
        ref={modalRef}
        className={`relative w-full ${sizes[size]} bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-700 my-8`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            className="absolute top-4 right-4 z-10 p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <FontAwesomeIcon icon={["fas", "times"]} className="text-lg" />
          </button>
        )}

        {/* Header */}
        {title && (
          <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {icon && (
                <FontAwesomeIcon
                  icon={icon}
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
        <div className="px-6 sm:px-8 py-6">{children}</div>
      </div>
    </div>
  );
}
