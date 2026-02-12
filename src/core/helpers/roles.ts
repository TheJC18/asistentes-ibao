/**
 * Obtener el nombre traducido del rol según idioma
 */
export function getRoleName(role: string, lang: 'es' | 'en' = 'es'): string {
  const names = {
    es: {
      [ROLES.ADMIN]: 'Administrador',
      [ROLES.USER]: 'Usuario',
    },
    en: {
      [ROLES.ADMIN]: 'Admin',
      [ROLES.USER]: 'User',
    },
  };
  return (names[lang]?.[role as RoleType]) || (lang === 'en' ? 'Not specified' : 'No especificado');
}
import { IconName } from '@fortawesome/fontawesome-svg-core';

/**
 * Constantes de roles del sistema
 */
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

/**
 * Tipo derivado de las constantes de roles
 */
export type RoleType = typeof ROLES[keyof typeof ROLES];

/**
 * Configuración de iconos por rol
 */
export const ROLE_ICONS: Record<RoleType, IconName> = {
  [ROLES.ADMIN]: 'crown',
  [ROLES.USER]: 'user',
};

/**
 * Configuración de colores para badges por rol
 */
export const ROLE_BADGE_COLORS: Record<RoleType, 'primary' | 'warning' | 'info' | 'success' | 'error'> = {
  [ROLES.ADMIN]: 'primary',
  [ROLES.USER]: 'warning',
};

/**
 * Obtener el icono asociado a un rol
 */
export const getRoleIcon = (role: string): IconName => {
  return ROLE_ICONS[role as RoleType] || ROLE_ICONS[ROLES.USER];
};

/**
 * Obtener el color del badge asociado a un rol
 */
export const getRoleBadgeColor = (role: string): 'primary' | 'warning' | 'info' | 'success' | 'error' => {
  return ROLE_BADGE_COLORS[role as RoleType] || ROLE_BADGE_COLORS[ROLES.USER];
};

/**
 * Obtener la clave de traducción para el badge del rol
 */
export const getRoleBadgeTranslationKey = (role: string): string => {
  const keys: Record<RoleType, string> = {
    [ROLES.ADMIN]: 'role.adminBadge',
    [ROLES.USER]: 'role.userBadge',
  };
  return keys[role as RoleType] || keys[ROLES.USER];
};

/**
 * Obtener la clave de traducción para el nombre completo del rol
 */
export const getRoleNameTranslationKey = (role: string): string => {
  const keys: Record<RoleType, string> = {
    [ROLES.ADMIN]: 'role.admin',
    [ROLES.USER]: 'role.user',
  };
  return keys[role as RoleType] || keys[ROLES.USER];
};

/**
 * Validar si un string es un rol válido
 */
export const isValidRole = (role: string): role is RoleType => {
  return Object.values(ROLES).includes(role as RoleType);
};