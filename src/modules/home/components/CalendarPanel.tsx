import { useState } from 'react';
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Filtros */}
      <div className="flex items-center justify-center mb-6 flex-wrap gap-4">

        {/* Filtros / Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FontAwesomeIcon icon={["fas", "calendar-check"]} className="mr-2" />
            Todo ({totalItems})
          </button>

          <button
            onClick={() => setActiveFilter('birthdays')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeFilter === 'birthdays'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FontAwesomeIcon icon={["fas", "cake-candles"]} className="mr-2" />
            Cumpleaños ({birthdayCount})
          </button>

          <button
            onClick={() => setActiveFilter('events')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeFilter === 'events'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FontAwesomeIcon icon={["fas", "calendar-days"]} className="mr-2" />
            Eventos ({eventCount})
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
