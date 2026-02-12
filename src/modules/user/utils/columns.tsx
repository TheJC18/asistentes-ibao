import { useCountryUtils } from '@/core/hooks/useCountryUtils';
import { useRoleUtils } from '@/core/hooks/useRoleUtils';
import Badge from '../../../core/components/ui/badge/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TableColumnBreakpoint, formatDateDMY } from './tableUtils';
import type { User } from '@/types';

// Custom hook para obtener las columnas de usuario con helpers reactivos
export function useUserColumns(translate: any) {
  const { getCountryName } = useCountryUtils();
  const { getRoleBadgeTranslationKey, getRoleIcon, getRoleName, isValidRole, roles, getRoleBadgeColor } = useRoleUtils();
  return [
    {
      key: 'avatar',
      label: translate.form.avatar,
      className: 'text-start',
      visibleOn: ["xs", "ss", "sm", "md", "lg", "xl"] as TableColumnBreakpoint[],
      render: (userItem: User) => {
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-secondary shadow">
              <img
                width={40}
                height={40}
                src={userItem.photoURL || userItem.avatar || '/user_default.png'}
                alt={userItem.displayName || userItem.name}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'displayName',
      label: translate.form.name,
      className: 'text-start font-semibold text-base md:text-lg text-text-primary',
      visibleOn: ["base", "2xs", "xs", "ss", "sm", "md", "lg", "xl"] as TableColumnBreakpoint[],
      render: (userItem: User) => userItem.displayName || userItem.name || translate.form.noName,
    },
    {
      key: 'role',
      label: translate.form.role,
      className: 'text-start',
      visibleOn: ["md", "lg", "xl"] as TableColumnBreakpoint[],
      render: (userItem: User) => {
        const translationKey = getRoleBadgeTranslationKey(userItem.role);
        const [section, key] = translationKey.split('.');
        const badgeText = translate[section as keyof typeof translate]?.[key as any] || userItem.role.toUpperCase();
        const badgeColor = getRoleBadgeColor(userItem.role);
        return (
          <Badge size="sm" color={badgeColor} startIcon={null} endIcon={null}>
            {badgeText}
          </Badge>
        );
      },
    },
    {
      key: 'isMember',
      label: translate.form.isMember,
      className: 'text-start',
      visibleOn: ["sm", "md", "lg", "xl"] as TableColumnBreakpoint[],
      render: (userItem: User) => {
        return (
          <Badge
            size="md"
            color={userItem.isMember === true ? 'success' : 'error'}
            variant="solid"
            startIcon={userItem.isMember === true ? <FontAwesomeIcon icon={["fas", "check"]} /> : <FontAwesomeIcon icon={["fas", "times"]} />}
            endIcon={null}
          >
            {null}
          </Badge>
        );
      },
    },
    { 
      key: 'nationality', 
      label: translate.form.nationality,  
      className: 'text-start text-text-primary', 
      visibleOn: ["md", "lg", "xl"] as TableColumnBreakpoint[],
      render: (userItem: User) => {
        const nationality = userItem.nationality;
        if (!nationality) return <span className="text-text-disabled">-</span>;
        if (nationality.length === 2) {
          const countryName = getCountryName(nationality);
          return countryName || nationality || '-';
        }
        return nationality || '-';
      }
    },
    { 
      key: 'email', 
      label: translate.form.email, 
      className: 'text-start text-text-primary', 
      visibleOn: ["lg", "xl"] as TableColumnBreakpoint[],
      render: (userItem: User) => userItem.email || <span className="text-text-disabled">-</span>
    },
    { 
      key: 'birthdate', 
      label: translate.form.birth, 
      className: 'text-start text-text-primary', 
      visibleOn: ["lg", "xl"] as TableColumnBreakpoint[],
      render: (userItem: User) => {
        const formatted = formatDateDMY(userItem.birthdate);
        return formatted === '-' ? <span className="text-text-disabled">-</span> : formatted;
      }
    },
  ];
}
