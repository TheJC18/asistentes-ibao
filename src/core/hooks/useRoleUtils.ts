// Hook para exponer utilidades de roles conectadas al idioma actual.
// Devuelve roles, getRoleName, isValidRole, getRoleIcon, etc. listos para usar.
import { useLanguage } from '@/core/context/LanguageContext';
import { getRoleName, isValidRole, getRoleIcon, getRoleBadgeTranslationKey, getRoleNameTranslationKey, getRoleBadgeColor } from '@/core/helpers/roles';
import { ROLES } from '@/core/helpers/roles';

export function useRoleUtils() {
  const { language } = useLanguage();
  return {
    roles: ROLES,
    getRoleName: (code: string) => getRoleName(code, language),
    isValidRole: (code: string) => isValidRole(code),
    getRoleIcon,
    getRoleBadgeTranslationKey,
    getRoleNameTranslationKey,
    getRoleBadgeColor,
  };
}
