// Hook para exponer utilidades de géneros conectadas al idioma actual.
// Devuelve genders, getGenderName, isValidGender listos para usar.
import { useLanguage } from '@/core/context/LanguageContext';
import { GENDERS, isValidGender, getGenderName } from '@/core/helpers/genders';

export function useGenderUtils() {
  const { language } = useLanguage();
  return {
    genders: Object.entries(GENDERS).map(([key, code]) => ({ code, name: getGenderName(code, language) })),
    getGenderName: (code: string) => getGenderName(code, language),
    isValidGender: (code: string) => isValidGender(code),
  };
}
