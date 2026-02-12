import { IconName } from '@fortawesome/fontawesome-svg-core';
import { gendersES } from '@/i18n/genders/es';
import { gendersEN } from '@/i18n/genders/en';

/**
 * Constantes de géneros del sistema
 */
export const GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

/**
 * Obtener el icono asociado a un género
 */
export const getGenderIcon = (gender: string): IconName => {
  return GENDER_ICONS[gender as GenderType]
};

/**
 * Obtener el color del badge asociado a un género
 */
export const getGenderBadgeColor = (gender: string): 'primary' | 'warning' | 'info' | 'success' | 'error' => {
  return GENDER_BADGE_COLORS[gender as GenderType]
};

/**
 * Configuración de iconos por género
 */
export const GENDER_ICONS: Record<GenderType, IconName> = {
  [GENDERS.MALE]: 'mars',
  [GENDERS.FEMALE]: 'venus',
};

/**
 * Configuración de colores para badges por género
 */
export const GENDER_BADGE_COLORS: Record<GenderType, 'primary' | 'warning' | 'info' | 'success' | 'error'> = {
  [GENDERS.MALE]: 'primary',
  [GENDERS.FEMALE]: 'warning',
};
/**
 * Tipo derivado de las constantes de género
 */
export type GenderType = typeof GENDERS[keyof typeof GENDERS];

/**
 * Validar si un string es un género válido
 */
export const isValidGender = (gender: string): gender is GenderType => {
  return Object.values(GENDERS).includes(gender as GenderType);
};

export function getGenderName(genderCode?: string, lang: 'es' | 'en' = 'es'): string {
  const list = lang === 'en' ? gendersEN : gendersES;
  const gender = list.find((g) => g.code === genderCode?.toLowerCase());
  return gender ? gender.name : lang === 'en' ? 'Not specified' : 'No especificado';
}