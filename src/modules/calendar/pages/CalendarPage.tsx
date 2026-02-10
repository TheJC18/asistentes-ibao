import { useEffect, useState } from 'react';
import { useTranslation } from '@/core/context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Calendar, { UserBirthday } from '@/core/components/ui/calendar/Calendar';
import { getAllUsersBirthdays } from '@/modules/user/firebase/userQueries';

export default function CalendarPage() {
  const translate = useTranslation();
  const [birthdays, setBirthdays] = useState<UserBirthday[]>([]);
  // Si necesitas eventos personalizados, puedes agregarlos aquí:
  // const [events, setEvents] = useState<CalendarEvent[]>([]);
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

      // Si necesitas cargar eventos personalizados, hazlo aquí
      
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
