import { useState } from 'react';
import { useTranslation } from '@/core/context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Calendar, { UserBirthday } from '@/core/components/ui/calendar/Calendar';

// Interface para eventos personalizados (reuniones, tareas, etc.)
export interface CustomEvent {
  id: string;
  title: string;
  date: string | Date;
  type: 'meeting' | 'task' | 'reminder' | string;
  color?: string;
}

type ViewFilter = 'all' | 'birthdays' | 'events';

interface CalendarPanelProps {
  birthdays?: UserBirthday[];
  events?: CustomEvent[];
  loading?: boolean;
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: any) => void;
}

export default function CalendarPanel({ 
  birthdays = [], 
  events = [], 
  loading = false,
  onDateClick,
  onEventClick
}: CalendarPanelProps) {
  const [activeFilter, setActiveFilter] = useState<ViewFilter>('all');
  const translate = useTranslation();

  // Filtrar datos según vista activa
  const getFilteredBirthdays = (): UserBirthday[] => {
    if (activeFilter === 'events') return [];
    return birthdays;
  };

  const getFilteredEvents = (): CustomEvent[] => {
    if (activeFilter === 'birthdays') return [];
    return events;
  };

  const totalItems = birthdays.length + events.length;
  const birthdayCount = birthdays.length;
  const eventCount = events.length;

  if (loading) {
    return (
      <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filtros */}
      <div className="flex items-center justify-center mb-6 flex-wrap gap-4">

        {/* Filtros / Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeFilter === 'all'
                ? 'bg-info text-text-on-primary'
                : 'bg-surface text-text-primary hover:bg-surface-hover'
            }`}
          >
            <FontAwesomeIcon icon={["fas", "calendar-check"]} className="mr-2" />
            {translate.pages?.members?.all} ({totalItems})
          </button>

          <button
            onClick={() => setActiveFilter('birthdays')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeFilter === 'birthdays'
                ? 'bg-secondary text-text-on-primary'
                : 'bg-surface text-text-primary hover:bg-surface-hover'
            }`}
          >
            <FontAwesomeIcon icon={["fas", "cake-candles"]} className="mr-2" />
            {translate.calendar?.birthdays || translate.pages?.members?.attendees} ({birthdayCount})
          </button>

          <button
            onClick={() => setActiveFilter('events')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeFilter === 'events'
                ? 'bg-success text-text-on-primary'
                : 'bg-surface text-text-primary hover:bg-surface-hover'
            }`}
          >
            <FontAwesomeIcon icon={["fas", "calendar-days"]} className="mr-2" />
            {translate.calendar?.events} ({eventCount})
          </button>
        </div>
      </div>

      {/* Calendario */}
      <Calendar
        birthdays={getFilteredBirthdays()}
        events={getFilteredEvents()}
        onDateClick={onDateClick}
        onEventClick={onEventClick}
      />
    </div>
  );
}
