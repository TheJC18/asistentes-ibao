import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../firebase/eventQueries';
import { EventData } from '@/modules/events/types';

export function useEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
      setError(null);
    } catch (e) {
      setError('Error loading events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (event: EventData) => {
    await createEvent(event);
    fetchEvents();
  };

  const editEvent = async (id: string, event: Partial<EventData>) => {
    await updateEvent(id, event);
    fetchEvents();
  };

  const removeEvent = async (id: string) => {
    await deleteEvent(id);
    fetchEvents();
  };

  return { events, loading, error, addEvent, editEvent, removeEvent, fetchEvents };
}