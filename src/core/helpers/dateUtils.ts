import { Timestamp } from 'firebase/firestore';

/**
 * Convierte diferentes formatos de fecha a objeto Date
 */
export const formatDate = (date: Date | Timestamp | string | null | undefined): Date | null => {
  if (!date) return null;

  try {
    // Si es un Timestamp de Firestore, convertir a Date
    if (date && typeof date === 'object' && 'toDate' in date) {
      return (date as Timestamp).toDate();
    }
    
    // Si es un string, convertir a Date
    if (typeof date === 'string') {
      return new Date(date);
    }

    // Si ya es Date, retornar tal cual
    if (date instanceof Date) {
      return date;
    }

    return null;
  } catch (error) {
    console.error('Error en formatDate:', error);
    return null;
  }
};

/**
 * Convierte Date/Timestamp a formato ISO string
 */
export const dateToISOString = (date: Date | Timestamp | string | null | undefined): string | null => {
  if (!date) return null;

  try {
    // Si es un Timestamp de Firestore, convertir a Date
    if (date && typeof date === 'object' && 'toDate' in date) {
      return (date as Timestamp).toDate().toISOString();
    }

    // Si es un string, convertir a Date primero
    if (typeof date === 'string') {
      return new Date(date).toISOString();
    }

    // Si es Date, convertir a ISO
    if (date instanceof Date) {
      return date.toISOString();
    }

    return null;
  } catch (error) {
    console.error('Error en dateToISOString:', error);
    return null;
  }
};

/**
 * Convierte campos de fecha en un objeto (Timestamps o strings) a Date
 */
export const formatDateFields = <T extends Record<string, any>>(obj: T): T => {
  if (!obj) return obj;

  const result = { ...obj };
  const dateFields = ['birthdate', 'createdAt', 'updatedAt', 'date'];

  dateFields.forEach(field => {
    if (result[field]) {
      result[field] = formatDate(result[field]);
    }
  });

  return result;
};

/**
 * Convierte campos de fecha en un objeto (Date/Timestamp) a ISO strings
 */
export const convertDateFieldsToISO = <T extends Record<string, any>>(obj: T): T => {
  if (!obj) return obj;

  const result = { ...obj };
  const dateFields = ['birthdate', 'createdAt', 'updatedAt', 'date'];

  dateFields.forEach(field => {
    if (result[field]) {
      result[field] = dateToISOString(result[field]);
    }
  });

  return result;
};

/**
 * Convierte fecha ISO a objeto Date para date-pickers
 */
export const convertISOToDate = (isoString: string | null | undefined): Date | null => {
  if (!isoString) return null;
  try {
    return new Date(isoString);
  } catch (error) {
    console.error('Error en convertISOToDate:', error);
    return null;
  }
};
