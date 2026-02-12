import { countriesES } from '@/i18n/countries/es';
import { countriesEN } from '@/i18n/countries/en';
import type { Country } from '@/types';

/**
 * Retorna la lista de países según el idioma
 */
export function getCountries(lang: 'es' | 'en' = 'es'): Country[] {
  return lang === 'en' ? countriesEN : countriesES;
}

/**
 * Valida si un código de país es válido para el idioma dado
 */
export function isValidCountryCode(code: string, lang: 'es' | 'en' = 'es'): boolean {
  return getCountries(lang).some((c) => c.code === code);
}

/**
 * Obtiene el nombre del país por código y idioma
 */
export function getCountryName(code?: string, lang: 'es' | 'en' = 'es'): string {
  if (!code) return lang === 'en' ? 'Not specified' : 'No especificado';
  const country = getCountries(lang).find((c) => c.code === code);
  return country ? country.name : (lang === 'en' ? 'Not specified' : 'No especificado');
}
