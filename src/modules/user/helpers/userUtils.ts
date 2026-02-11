// Utilidades para validación de datos de usuario
import { countriesES, countriesEN } from "@/i18n/countries";

// Obtener nombre del país por código
export const getCountryNameByCode = (countryCode: string, language: 'es' | 'en' = 'es'): string | null => {
  if (!countryCode) return null;
  
  const countries = language === 'es' ? countriesES : countriesEN;
  const country = countries.find(c => c.code === countryCode);
  
  return country ? country.name : null;
};