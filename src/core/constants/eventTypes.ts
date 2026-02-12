export const EVENT_TYPES = [
  { code: 'normal', color: 'bg-blue-500', i18n: { es: 'Normal', en: 'Normal' } },
  { code: 'important', color: 'bg-red-500', i18n: { es: 'Importante', en: 'Important' } },
  { code: 'meeting', color: 'bg-green-500', i18n: { es: 'Reunión', en: 'Meeting' } },
  { code: 'birthday', color: 'bg-yellow-500', i18n: { es: 'Cumpleaños', en: 'Birthday' } },
];

export type EventTypeCode = 'normal' | 'important' | 'meeting' | 'birthday';

export function getEventTypeLabel(code: EventTypeCode, lang: 'es' | 'en' = 'es') {
  const found = EVENT_TYPES.find(t => t.code === code);
  return found ? found.i18n[lang] : code;
}