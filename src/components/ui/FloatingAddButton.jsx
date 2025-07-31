import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Botón flotante reutilizable para agregar elementos
 * @param {Object} props
 * @param {function} props.onClick - Acción al hacer click
 * @param {string} [props.title="Agregar"] - Tooltip del botón
 * @param {string} [props.className] - Clases adicionales
 * @param {React.ReactNode} [props.icon] - Icono a mostrar (por defecto un "+")
 */
export default function FloatingAddButton({ onClick, title = "Agregar", className = "", icon }) {
  return (
    <button
      className={`fixed bottom-15 right-2 z-5 bg-blue-400 hover:bg-blue-700 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-2xl transition-all text-4xl dark:border-gray-900 hover:scale-110 hover:rotate-6 opacity-60 hover:opacity-100 ${className}`}
      title={title}
      onClick={onClick}
    >
      {icon || <FontAwesomeIcon icon={["fas", "plus"]} />}
    </button>
  );
}
