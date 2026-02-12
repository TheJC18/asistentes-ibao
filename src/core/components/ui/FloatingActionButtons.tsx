import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FloatingActionButton, FloatingActionButtonsProps } from '@/types';

const colorClasses = {
  blue: 'bg-info hover:bg-info/80',
  green: 'bg-success hover:bg-success/80',
  red: 'bg-error hover:bg-error/80',
  purple: 'bg-secondary hover:bg-secondary-hover',
  pink: 'bg-secondary hover:bg-secondary-hover',
  yellow: 'bg-warning hover:bg-warning/80',
};

export default function FloatingActionButtons({ buttons }: FloatingActionButtonsProps) {
  if (buttons.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {buttons.map((button, index) => (
        <button
          key={index}
          className={`${colorClasses[button.color || 'blue']} text-text-on-primary rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-all hover:scale-110 group`}
          title={button.title}
          onClick={button.onClick}
        >
          <FontAwesomeIcon icon={button.icon} className="text-2xl" />
          {button.tooltip && (
            <span className="absolute right-20 bg-overlay text-text-on-primary px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {button.tooltip}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
