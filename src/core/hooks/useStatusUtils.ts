// Hook para exponer utilidades de estatus conectadas al idioma actual.
// Devuelve statuses, getStatusLabel, isValidStatus listos para usar.
import { useLanguage } from '@/core/context/LanguageContext';
import { getStatusLabel, isValidStatus, STATUS } from '@/core/helpers/status';

export function useStatusUtils() {
  const { language } = useLanguage();
  return {
    statuses: STATUS,
    getStatusLabel: (code: string) => getStatusLabel(code, language),
    isValidStatus: (code: string) => isValidStatus(code),
  };
}
