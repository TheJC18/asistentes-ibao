import { useEffect, useState } from 'react';
import { getAllUsersBirthdays } from '@/modules/user/firebase/userQueries';
import { UserBirthday } from '@/core/components/ui/calendar/Calendar';

export function useCalendarPageLogic() {
  const [birthdays, setBirthdays] = useState<UserBirthday[]>([]);
  // const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendarData();
    // eslint-disable-next-line
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

  return {
    birthdays,
    // events,
    loading,
    handleDateClick,
    handleEventClick,
  };
}
