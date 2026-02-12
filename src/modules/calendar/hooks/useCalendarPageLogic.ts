import { useEffect, useState } from 'react';
import { getAllUsersBirthdays } from '@/modules/user/firebase/userQueries';
import { useEvents } from '@/modules/events/store/useEvents';
import type { CalendarEvent, UserBirthday } from '@/core/components/types';

export function useCalendarPageLogic() {
  const [birthdays, setBirthdays] = useState<UserBirthday[]>([]);
  const { events: rawEvents, loading: loadingEvents } = useEvents();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para modal de detalle diario
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);
  const [dayBirthdays, setDayBirthdays] = useState<UserBirthday[]>([]);

  // Estado para modal de detalle de evento
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Estado para modal de cumpleaños
  const [selectedBirthday, setSelectedBirthday] = useState<UserBirthday | null>(null);
  const [selectedBirthdayAge, setSelectedBirthdayAge] = useState<number | undefined>(undefined);
  const [selectedBirthdayDate, setSelectedBirthdayDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    loadCalendarData();
    // eslint-disable-next-line
  }, [rawEvents]);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      // Cargar cumpleaños de todos los usuarios
      const birthdaysData = await getAllUsersBirthdays();
      setBirthdays(birthdaysData);
      // Mapear eventos a CalendarEvent
      const mappedEvents = (rawEvents || []).map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        type: event.type,
        color: event.color,
        allDay: false,
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error('Error al cargar datos del calendario:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar eventos y cumpleaños del día seleccionado
  const openDayDetail = (date: Date) => {
    setSelectedDate(date);
    // Eventos
    const filteredEvents = (events || []).filter(ev => {
      const evDate = new Date(ev.date);
      return evDate.getDate() === date.getDate() &&
        evDate.getMonth() === date.getMonth() &&
        evDate.getFullYear() === date.getFullYear();
    });
    setDayEvents(filteredEvents);
    // Cumpleaños
    const filteredBirthdays = (birthdays || []).filter(b => {
      const bDate = new Date(b.birthdate);
      return bDate.getDate() === date.getDate() && bDate.getMonth() === date.getMonth();
    });
    setDayBirthdays(filteredBirthdays);
  };

  const closeDayDetail = () => {
    setSelectedDate(null);
    setDayEvents([]);
    setDayBirthdays([]);
  };

  const handleDateClick = (date: Date) => {
    openDayDetail(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === 'birthday') {
      // Buscar el cumpleaños real
      const birthday = birthdays.find(birthday => event.title.includes(birthday.name));
      if (birthday) {
        // Si hay un día seleccionado, úsalo como fecha de consulta
        setSelectedBirthday(birthday);
        setSelectedBirthdayDate(selectedDate || undefined);
        setSelectedBirthdayAge(undefined);
        return;
      }
    }
    setSelectedEvent(event);
  };

  const closeEventDetail = () => {
    setSelectedEvent(null);
  };

  const closeBirthdayDetail = () => {
    setSelectedBirthday(null);
    setSelectedBirthdayAge(undefined);
    setSelectedBirthdayDate(undefined);
  };

  // Nuevo: abrir cumpleaños desde el detalle del día
  const handleBirthdayClick = (birthday: UserBirthday, date: Date) => {
    setSelectedBirthday(birthday);
    setSelectedBirthdayDate(date);
    setSelectedBirthdayAge(undefined); // Se calcula en el modal
  };

  return {
    birthdays,
    events,
    loading: loading || loadingEvents,
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
  };
}
