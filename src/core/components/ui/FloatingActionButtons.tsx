import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface FloatingActionButton {
  icon: IconProp;
  onClick: () => void;
  title: string;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'pink' | 'yellow';
  tooltip?: string;
}

interface FloatingActionButtonsProps {
  buttons: FloatingActionButton[];
}

const colorClasses = {
  blue: 'bg-blue-500 hover:bg-blue-600',
  green: 'bg-green-500 hover:bg-green-600',
  red: 'bg-red-500 hover:bg-red-600',
  purple: 'bg-purple-500 hover:bg-purple-600',
  pink: 'bg-pink-500 hover:bg-pink-600',
  yellow: 'bg-yellow-500 hover:bg-yellow-600',
};

export default function FloatingActionButtons({ buttons }: FloatingActionButtonsProps) {
  if (buttons.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {buttons.map((button, index) => (
        <button
          key={index}
          className={`${colorClasses[button.color || 'blue']} text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-all hover:scale-110 group`}
          title={button.title}
          onClick={button.onClick}
        >
          <FontAwesomeIcon icon={button.icon} className="text-2xl" />
          {button.tooltip && (
            <span className="absolute right-20 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {button.tooltip}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
