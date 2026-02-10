import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '@/core/context/LanguageContext';
import Badge from '@/core/components/ui/badge/Badge';
import FloatingActionButtons from '@/core/components/ui/FloatingActionButtons';
import { useSidebar } from "@/core/context/SidebarContext";
import React, { Suspense } from 'react';
const UserModal = React.lazy(() => import('@/modules/user/components/UserModal'));
import EntityList from '@/core/components/ui/table/EntityList';
import { getCountryNameByCode } from '@/modules/user/helpers/userUtils';
import { useUserManagement } from '@/modules/user/hooks/useUserManagement';
import { getRoleBadgeColor, getRoleBadgeTranslationKey } from '@/core/constants/roles';
import { User } from '@/types';

export default function UserListPage() {
  const sidebar = useSidebar();
  const translate = useTranslation();
  
  // Hook de gestión de usuarios (contiene toda la lógica)
  const {
    users,
    isLoading,
    error,
    isDeleting,
    modalOpen,
    modalMode,
    selectedUser,
    handleSave,
    handleDelete,
    handleView,
    handleEdit,
    handleCreate,
    handleClose,
    handleRetry,
    handlePasswordReset,
  } = useUserManagement();

  const columns = [
    {
      key: 'avatar',
      label: translate.form.avatar,
      className: 'text-start',
      visibleOn: ["xs", "ss", "sm", "md", "lg", "xl"], // Visible desde xs en adelante
      render: (userItem: User) => (
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
      ),
    },
    {
      key: 'displayName',
      label: translate.form.name,
      className: 'text-start font-semibold text-base md:text-lg text-text-primary',
      visibleOn: ["base", "2xs", "xs", "ss", "sm", "md", "lg", "xl"], // Siempre visible
      render: (userItem: User) => userItem.displayName || userItem.name || translate.form.noName,
    },
    {
      key: 'role',
      label: translate.form.role,
      className: 'text-start',
      visibleOn: ["md", "lg", "xl"], // Visible desde ss en adelante
      render: (userItem: User) => {
        const badgeColor = getRoleBadgeColor(userItem.role);
        const translationKey = getRoleBadgeTranslationKey(userItem.role);
        const [section, key] = translationKey.split('.');
        const badgeText = translate[section as keyof typeof translate]?.[key as any] || userItem.role.toUpperCase();
        
        return (
          <Badge size="sm" color={badgeColor}>
            {badgeText}
          </Badge>
        );
      },
    },
    {
      key: 'isMember',
      label: translate.form.isMember,
      className: 'text-start',
      visibleOn: ["sm", "md", "lg", "xl"], // Visible desde sm en adelante
      render: (userItem: User) => (
        <Badge size="md" color={userItem.isMember === true ? 'success' : 'error'} variant="solid">
          {userItem.isMember === true ? <FontAwesomeIcon icon={["fas", "check"]} /> : <FontAwesomeIcon icon={["fas", "times"]} />}
        </Badge>
      ),
    },
    { 
      key: 'nationality', 
      label: translate.form.nationality,  
      className: 'text-start text-text-primary', 
      visibleOn: ["md", "lg", "xl"],
      render: (userItem: User) => {
        const nationality = userItem.nationality;
        if (!nationality) return <span className="text-text-disabled">-</span>;
        
        // Si tiene 2 caracteres, asumimos que es un código
        if (nationality.length === 2) {
          const countryName = getCountryNameByCode(nationality);
          return countryName || nationality || '-';
        }
        
        // Si es más largo, asumimos que ya es el nombre del país
        return nationality || '-';
      }
    },
    { 
      key: 'email', 
      label: translate.form.email, 
      className: 'text-start text-text-primary', 
      visibleOn: ["lg", "xl"],
      render: (userItem: User) => userItem.email || <span className="text-text-disabled">-</span>
    },
    { 
      key: 'birthdate', 
      label: translate.form.birth, 
      className: 'text-start text-text-primary', 
      visibleOn: ["lg", "xl"],
      render: (userItem: User) => {
        if (!userItem.birthdate) return <span className="text-text-disabled">-</span>;
        try {
          const date = new Date(userItem.birthdate);
          // Corrige el año para evitar '20260' y muestra formato correcto
          if (isNaN(date.getTime())) return <span className="text-text-disabled">-</span>;
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          return `${dd}/${mm}/${yyyy}`;
        } catch {
          return <span className="text-text-disabled">-</span>;
        }
      }
    },
  ];

  const filterFunction = (u: User, search: string) => {
    const name = u.displayName || u.name || '';
    const email = u.email || '';
    return name.toLowerCase().includes(search.toLowerCase()) ||
           email.toLowerCase().includes(search.toLowerCase());
  };

  const renderActions = (userItem: User) => (
    <div className="flex flex-row gap-1 items-center justify-center">
      <button 
        className="p-1 h-7 w-7 text-xs rounded-full bg-info hover:bg-info/80 text-text-on-primary transition" 
        title={translate.common.viewDetails} 
        onClick={() => handleView(userItem)}
        disabled={isDeleting}
      >
        <FontAwesomeIcon icon={["fas", "eye"]} />
      </button>
      <button 
        className="p-1 h-7 w-7 text-xs rounded-full bg-success hover:bg-success/80 text-text-on-primary transition" 
        title={translate.common.editUser} 
        onClick={() => handleEdit(userItem)}
        disabled={isDeleting}
      >
        <FontAwesomeIcon icon={["fas", "edit"]} />
      </button>
      <button 
        className={`p-1 h-7 w-7 text-xs rounded-full transition ${
          isDeleting 
            ? 'bg-surface text-text-disabled cursor-not-allowed' 
            : 'bg-error hover:bg-error/80 text-text-on-primary'
        }`}
        title={translate.common.deleteUser} 
        onClick={() => handleDelete(userItem)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <FontAwesomeIcon icon={["fas", "spinner"]} className="animate-spin" />
        ) : (
          <FontAwesomeIcon icon={["fas", "trash"]} />
        )}
      </button>
    </div>
  );

  return (
    <>
      <EntityList<User>
        title={
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={["fas", "address-book"]} className="text-primary text-3xl" />
            <h2 className="text-3xl font-bold text-text-primary">{translate.pages.users.title}</h2>
          </div>
        }
        description={translate.pages.users.description}
        data={users}
        columns={columns}
        renderActions={renderActions}
        filterFunction={filterFunction}
        isLoading={isLoading}
        error={error}
        onRetry={handleRetry}
        noDataMessage={translate.pages.users.noUsers}
      />

      {!(sidebar && sidebar.isMobileOpen) && (
        <FloatingActionButtons 
          buttons={[
            {
              icon: ["fas", "plus"],
              onClick: handleCreate,
              title: translate.pages.users.addUser,
              tooltip: translate.pages.users.addUser,
              color: "blue"
            }
          ]}
        />
      )}

      <Suspense fallback={<div className="flex justify-center items-center min-h-[20vh]"><span className="text-lg">Cargando modal...</span></div>}>
        <UserModal
          open={modalOpen}
          onClose={handleClose}
          mode={modalMode}
          user={selectedUser}
          onSave={handleSave}
        />
      </Suspense>
    </>
  );
}
