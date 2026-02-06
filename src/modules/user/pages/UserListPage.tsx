import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '../../../context/LanguageContext';
import Badge from '../../../components/ui/badge/Badge';
import FloatingAddButton from '../../../components/ui/FloatingAddButton';
import UserModal from '../components/UserModal';
import EntityList from '../../../components/ui/table/EntityList';
import { getCountryNameByCode } from '../helpers/userUtils';
import { useUserManagement } from '../hooks/useUserManagement';
import { User } from '../../../types';

export default function UserListPage() {
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
          <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-blue-400 shadow">
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
      className: 'text-start font-semibold text-base md:text-lg text-gray-900 dark:text-gray-100',
      visibleOn: ["base", "2xs", "xs", "ss", "sm", "md", "lg", "xl"], // Siempre visible
      render: (userItem: User) => userItem.displayName || userItem.name || translate.form.noName,
    },
    {
      key: 'role',
      label: translate.form.role,
      className: 'text-start',
      visibleOn: ["md", "lg", "xl"], // Visible desde ss en adelante
      render: (userItem: User) => (
        <Badge size="sm" color={userItem.role === 'admin' ? 'primary' : 'warning'}>
          {userItem.role === 'admin' ? translate.role.adminBadge : translate.role.userBadge}
        </Badge>
      ),
    },
    {
      key: 'isMember',
      label: translate.form.isMember,
      className: 'text-start',
      visibleOn: ["sm", "md", "lg", "xl"], // Visible desde sm en adelante
      render: (userItem: User) => (
        <Badge size="xl" color={userItem.isMember === true ? 'success' : 'error'} variant="solid">
          {userItem.isMember === true ? <FontAwesomeIcon icon={["fas", "check"]} /> : <FontAwesomeIcon icon={["fas", "times"]} />}
        </Badge>
      ),
    },
    { 
      key: 'nationality', 
      label: translate.form.nationality,  
      className: 'text-start text-gray-800 dark:text-gray-200', 
      visibleOn: ["md", "lg", "xl"],
      render: (userItem: User) => {
        const nationality = userItem.nationality;
        if (!nationality) return <span className="text-gray-400 dark:text-gray-500">-</span>;
        
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
      className: 'text-start text-gray-800 dark:text-gray-200', 
      visibleOn: ["lg", "xl"],
      render: (userItem: User) => userItem.email || <span className="text-gray-400 dark:text-gray-500">-</span>
    },
    { 
      key: 'birthdate', 
      label: translate.form.birth, 
      className: 'text-start text-gray-800 dark:text-gray-200', 
      visibleOn: ["lg", "xl"],
      render: (userItem: User) => {
        if (!userItem.birthdate) return <span className="text-gray-400 dark:text-gray-500">-</span>;
        try {
          const date = new Date(userItem.birthdate);
          return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
        } catch {
          return <span className="text-gray-400 dark:text-gray-500">-</span>;
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
        className="p-1 h-7 w-7 text-xs rounded-full bg-blue-500/80 hover:bg-blue-700 text-white transition" 
        title={translate.common.viewDetails} 
        onClick={() => handleView(userItem)}
        disabled={isDeleting}
      >
        <FontAwesomeIcon icon={["fas", "eye"]} />
      </button>
      <button 
        className="p-1 h-7 w-7 text-xs rounded-full bg-green-500/80 hover:bg-green-700 text-white transition" 
        title={translate.common.editUser} 
        onClick={() => handleEdit(userItem)}
        disabled={isDeleting}
      >
        <FontAwesomeIcon icon={["fas", "edit"]} />
      </button>
      <button 
        className={`p-1 h-7 w-7 text-xs rounded-full transition ${
          isDeleting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-red-500/80 hover:bg-red-700'
        } text-white`}
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
        title={translate.pages.users.title}
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

      <FloatingAddButton onClick={handleCreate} />

      <UserModal
        open={modalOpen}
        onClose={handleClose}
        mode={modalMode}
        user={selectedUser}
        onSave={handleSave}
      />
    </>
  );
}
