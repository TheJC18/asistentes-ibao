// Hook para exponer utilidades de países conectadas al idioma actual.
// Devuelve countries, getCountryName, isValidCountryCode listos para usar.
import { useLanguage } from '@/core/context/LanguageContext';
import { getCountries, getCountryName, isValidCountryCode } from '@/core/helpers/countries';

export function useCountryUtils() {
  const { language } = useLanguage();
  return {
    countries: getCountries(language),
    getCountryName: (code?: string) => getCountryName(code, language),
    isValidCountryCode: (code: string) => isValidCountryCode(code, language),
  };
}
