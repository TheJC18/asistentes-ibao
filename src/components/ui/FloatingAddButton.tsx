import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface FloatingAddButtonProps {
  onClick: () => void;
  title?: string;
  className?: string;
  icon?: ReactNode;
}

export default function FloatingAddButton({ 
  onClick, 
  title = "Agregar", 
  className = "", 
  icon 
}: FloatingAddButtonProps) {
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
