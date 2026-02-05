interface CalendarEvent {
  id: string | number;
  title: string;
  date: string | Date;
  type?: string;
  color?: 'blue' | 'green' | 'red' | 'pink' | string;
  allDay?: boolean;
}

interface DayCell {
  date: Date;
  isCurrentMonth: boolean;
}

interface CalendarGridProps {
  currentDate: Date;
  events?: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function CalendarGrid({ currentDate, events = [], onDateClick, onEventClick }: CalendarGridProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Primer día del mes
  const firstDayOfMonth = new Date(year, month, 1);
  // Último día del mes
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
  let firstDayWeekday = firstDayOfMonth.getDay();
  // Ajustar para que lunes sea 0
  firstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

  // Días del mes anterior a mostrar
  const prevMonthDays = firstDayWeekday;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  // Total de celdas a mostrar (6 semanas)
  const totalCells = 42;
  const daysInMonth = lastDayOfMonth.getDate();

  const days: DayCell[] = [];

  // Días del mes anterior
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(year, month - 1, day);
    days.push({ date, isCurrentMonth: false });
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({ date, isCurrentMonth: true });
  }

  // Días del mes siguiente
  const remainingCells = totalCells - days.length;
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(year, month + 1, day);
    days.push({ date, isCurrentMonth: false });
  }

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    if (!events || events.length === 0) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const handleDateClick = (date: Date): void => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent): void => {
    if (onEventClick) {
      e.stopPropagation();
      onEventClick(event);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Header de días */}
      <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900/50">
        {DAYS.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7">
        {days.map(({ date, isCurrentMonth }, index) => {
          const dayEvents = getEventsForDate(date);
          const isTodayDate = isToday(date);

          return (
            <div
              key={index}
              className={`min-h-[120px] border-b border-r border-gray-200 dark:border-gray-600 p-2 ${
                !isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900/30' : 'bg-white dark:bg-gray-800'
              } ${(index + 1) % 7 === 0 ? 'border-r-0' : ''} hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer`}
              onClick={() => handleDateClick(date)}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`text-sm font-medium ${
                    !isCurrentMonth
                      ? 'text-gray-400 dark:text-gray-500'
                      : isTodayDate
                      ? 'bg-brand-500 text-white w-7 h-7 rounded-full flex items-center justify-center'
                      : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {date.getDate()}
                </span>
              </div>

              {/* Eventos */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => handleEventClick(event, e)}
                    className={`text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition ${
                      event.type === 'birthday'
                        ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                        : event.color === 'blue'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : event.color === 'green'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : event.color === 'red'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                    }`}
                  >
                    {event.allDay ? '' : new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' '}
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                    +{dayEvents.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
