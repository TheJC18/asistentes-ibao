import { relationCodes, inverseRelationsMap } from './relations-es';
import { Gender } from '../types';

// Lista de géneros para el selector (con códigos en inglés y labels en inglés)
export const gendersEN: Gender[] = [
  { code: 'male', name: 'Male' },
  { code: 'female', name: 'Female' },
];

export const getGenderName = (genderCode?: string): string => {
  const gender = gendersEN.find(g => g.code === genderCode?.toLowerCase());
  return gender ? gender.name : 'Not specified';
};

// Re-exportar utilidades de relations-es para mantener compatibilidad
export { relationCodes, inverseRelationsMap };
