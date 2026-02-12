import { useTranslation } from '@/core/context';
import type { CalendarEvent, DayCell, CalendarGridProps } from '../../types';

export default function CalendarGrid({ currentDate, events = [], onDateClick, onEventClick, readOnly = false }: CalendarGridProps) {
  const translate = useTranslation();
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

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
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
    if (readOnly) return;
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent): void => {
    if (readOnly) return;
    if (onEventClick) {
      e.stopPropagation();
      onEventClick(event);
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header de días */}
      <div className="grid grid-cols-7 bg-surface">
        {translate.calendar.days.map((day) => (
          <div
            key={day}
            className="py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-text-primary border-b border-border"
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
              className={`min-h-[80px] sm:min-h-[140px] border-b border-r border-border p-1 sm:p-2 ${
                !isCurrentMonth ? 'bg-surface' : 'bg-card'
              } ${(index + 1) % 7 === 0 ? 'border-r-0' : ''} ${readOnly ? '' : 'hover:bg-surface cursor-pointer'} transition`}
              onClick={() => handleDateClick(date)}
            >
              <div className="flex justify-between items-start mb-0.5 sm:mb-1">
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    !isCurrentMonth
                      ? 'text-text-disabled'
                      : isTodayDate
                      ? 'bg-primary text-text-on-primary w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center'
                      : isWeekend(date)
                      ? 'text-error'
                      : 'text-text-primary'
                  }`}
                >
                  {date.getDate()}
                </span>
              </div>

              {/* Eventos */}
              <div className="space-y-0.5 sm:space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => handleEventClick(event, e)}
                    className={`text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded truncate cursor-pointer hover:opacity-80 transition ${
                      event.type === 'birthday'
                        ? 'bg-secondary-light text-secondary'
                        : event.color === 'blue'
                        ? 'bg-info-light text-info'
                        : event.color === 'green'
                        ? 'bg-success-light text-success'
                        : event.color === 'red'
                        ? 'bg-error-light text-error'
                        : 'bg-primary-light text-primary'
                    }`}
                  >
                    {event.allDay ? '' : new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' '}
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] sm:text-xs text-text-secondary px-1 sm:px-2">
                    +{dayEvents.length - 3} {translate.calendar.more}
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
