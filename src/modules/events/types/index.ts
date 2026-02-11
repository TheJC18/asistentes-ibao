import type { ModalMode } from '@/types';

export interface UseEventModalProps {
  open: boolean;
  event?: Partial<EventData>;
  mode?: ModalMode;
  onSave?: (data: EventData) => void;
}
// Tipos y interfaces para el módulo de eventos

export interface EventData {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  type?: string;
  color?: string;
  createdBy: string;
}

export interface EventFormData {
  title: string;
  description?: string;
  date: string;
  type?: string;
  color?: string;
  createdBy: string;
}

export interface EventModalProps {
  open: boolean;
  onClose: () => void;
  mode?: ModalMode;
  event?: Partial<EventData>;
  onSave?: (data: EventData) => void;
}

export interface UseEventsResult {
  events: EventData[];
  loading: boolean;
  error: string | null;
  addEvent: (event: EventData) => Promise<void>;
  editEvent: (id: string, event: Partial<EventData>) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
  fetchEvents: () => Promise<void>;
}
