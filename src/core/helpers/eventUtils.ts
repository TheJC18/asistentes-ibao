import { eventTypesES } from '@/i18n/eventTypes/es';
import { eventTypesEN } from '@/i18n/eventTypes/en';

export const EVENT_TYPES = [
  { code: 'normal', color: 'bg-blue-500' },
  { code: 'important', color: 'bg-red-500' },
  { code: 'meeting', color: 'bg-green-500' },
  { code: 'birthday', color: 'bg-yellow-500' },
];

export type EventTypeCode = 'normal' | 'important' | 'meeting' | 'birthday';

export function getEventTypes(lang: 'es' | 'en' = 'es') {
  const labels = lang === 'es' ? eventTypesES : eventTypesEN;
  return EVENT_TYPES.map(t => ({ code: t.code, label: labels[t.code], color: t.color }));
}

export function getEventTypeLabel(code: EventTypeCode, lang: 'es' | 'en' = 'es') {
  const labels = lang === 'es' ? eventTypesES : eventTypesEN;
  return labels[code] || code;
}