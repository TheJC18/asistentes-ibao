import type { EventTypeCode } from '@/core/constants/eventTypes';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  hour: string; // Nuevo campo para hora
  type: EventTypeCode;
  color: string;
}
