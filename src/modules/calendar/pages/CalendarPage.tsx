import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DayDetailModal } from '../components/DayDetailModal';
import { EventDetailModal } from '../components/EventDetailModal';
import { BirthdayDetailModal } from '../components/BirthdayDetailModal';

import { useTranslation } from '@/core/context/LanguageContext';
import Calendar from '@/core/components/ui/calendar/Calendar';
import { useCalendarPageLogic } from '../hooks/useCalendarPageLogic';

export function CalendarPage() {
  const translate = useTranslation();
  const {
    birthdays,
    events,
    handleDateClick,
    handleEventClick,
    handleBirthdayClick,
    selectedDate,
    dayEvents,
    dayBirthdays,
    closeDayDetail,
    selectedEvent,
    closeEventDetail,
    selectedBirthday,
    selectedBirthdayAge,
    selectedBirthdayDate,
    closeBirthdayDetail,
  } = useCalendarPageLogic();

  return (
    <div className="flex flex-col h-full">
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
        events={events}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
      />

      {/* Modal de detalle del día */}
      {selectedDate && (
        <DayDetailModal
          open={!!selectedDate}
          date={selectedDate}
          events={dayEvents}
          birthdays={dayBirthdays}
          onClose={closeDayDetail}
          onEventClick={handleEventClick}
          onBirthdayClick={handleBirthdayClick}
        />
      )}
      {/* Modal de detalle de evento/cumpleaños */}
      {selectedBirthday && (
        <BirthdayDetailModal
          open={!!selectedBirthday}
          birthday={selectedBirthday}
          age={selectedBirthdayDate ? undefined : selectedBirthdayAge}
          onClose={closeBirthdayDetail}
          {...(selectedBirthdayDate ? { date: selectedBirthdayDate } : {})}
        />
      )}
      {selectedEvent && !selectedBirthday && (
        <EventDetailModal
          open={!!selectedEvent}
          event={selectedEvent}
          onClose={closeEventDetail}
        />
      )}
    </div>
  );
}
