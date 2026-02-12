/**
 * Constantes de estados de usuario del sistema
 */
/**
 * Constantes de estados de usuario del sistema
 */
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

/**
 * Tipo derivado de las constantes de estado
 */
export type UserStatus = typeof STATUS[keyof typeof STATUS];

/**
 * Colores de badge por estado
 */
export const STATUS_BADGE_COLORS: Record<UserStatus, 'success' | 'warning' | 'error'> = {
  [STATUS.ACTIVE]: 'success',
  [STATUS.INACTIVE]: 'warning',
  [STATUS.SUSPENDED]: 'error',
};

/**
 * Validar si un string es un estado válido
 */
export const isValidStatus = (status: string): status is UserStatus => {
  return Object.values(STATUS).includes(status as UserStatus);
};

/**
 * Obtener el nombre traducido del estado
 */
import { es } from '@/i18n/locales/es';
import { en } from '@/i18n/locales/en';
export function getStatusLabel(status: string, lang: 'en' | 'es' = 'es'): string {
  const labels = {
    es: {
      active: 'Activo',
      inactive: 'Inactivo',
      pending: 'Pendiente',
      banned: 'Baneado',
    },
    en: {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      banned: 'Banned',
    },
  };
  return (labels[lang][status as UserStatus]) || (lang === 'en' ? 'Not specified' : 'No especificado');
}