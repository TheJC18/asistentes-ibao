import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserBirthday } from '@/core/components/ui/calendar/Calendar';
import CalendarPanel, { CustomEvent } from '@/modules/home/components/CalendarPanel';
import { getAllUsersBirthdays } from '@/modules/user/firebase/userQueries';

export default function CalendarPage() {
  const [birthdays, setBirthdays] = useState<UserBirthday[]>([]);
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      // Cargar cumpleaños de todos los usuarios
      const birthdaysData = await getAllUsersBirthdays();
      setBirthdays(birthdaysData);

      // TODO: Aquí se pueden cargar eventos personalizados desde Firebase
      // const eventsData = await getAllCustomEvents();
      // setCustomEvents(eventsData);
      
    } catch (error) {
      console.error('Error al cargar datos del calendario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: Date) => {
    console.log('Fecha seleccionada:', date);
    // TODO: Abrir modal para agregar evento en esta fecha
  };

  const handleEventClick = (event: any) => {
    console.log('Evento seleccionado:', event);
    // TODO: Abrir modal con detalles del evento o perfil de usuario
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FontAwesomeIcon icon={["fas", "calendar-alt"]} className="text-blue-600 dark:text-blue-400 text-3xl" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendario</h1>
        </div>
      </div>

      {/* Calendario */}
      <CalendarPanel 
        birthdays={birthdays}
        events={customEvents}
        loading={loading}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
      />
    </div>
  );
}
