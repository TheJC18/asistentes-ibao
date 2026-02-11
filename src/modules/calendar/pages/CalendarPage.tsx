import { useTranslation } from '@/core/context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Calendar from '@/core/components/ui/calendar/Calendar';
import { useCalendarPageLogic } from '../hooks/useCalendarPageLogic';

export function CalendarPage() {
  const translate = useTranslation();
  const { birthdays, loading, handleDateClick, handleEventClick } = useCalendarPageLogic();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FontAwesomeIcon icon={["fas", "calendar-alt"]} className="text-primary text-3xl" />
          <h1 className="text-3xl font-bold text-text-primary">{translate.pages?.calendar?.title}</h1>
        </div>
      </div>

      {/* Calendario */}
      <Calendar
        birthdays={birthdays}
        // events={events} // Si tienes eventos personalizados, pásalos aquí
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
      />
    </div>
  );
}
