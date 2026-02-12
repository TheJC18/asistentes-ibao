import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '@/core/context/LanguageContext';
import FloatingActionButtons from '@/core/components/ui/FloatingActionButtons';
import { useSidebar } from "@/core/context/SidebarContext";
import { lazy, Suspense } from 'react';
import EntityList from '@/core/components/ui/table/EntityList';
import { useUserManagement } from '@/modules/user/hooks/useUserManagement';
import { useUserColumns } from '../utils/columns';
import { filterUserBySearch, renderUserActions } from '../utils/userTableUtils';
import { User } from '@/types';

export default function UserListPage() {
  const translate = useTranslation();
  const sidebar = useSidebar();
  const UserModal = lazy(() => import('@/modules/user/components/UserModal'));

  const {
    users,
    isLoading,
    error,
    handleView,
    handleEdit,
    handleDelete,
    handleRetry,
    handleCreate,
    handleClose,
    modalOpen,
    modalMode,
    selectedUser,
    isDeleting,
    handleSave
  } = useUserManagement();
  const columns = useUserColumns(translate);

  const filterFunction = filterUserBySearch;
  const renderActions = (userItem: User) => renderUserActions({
    userItem,
    translate,
    handleView,
    handleEdit,
    handleDelete,
    isDeleting
  });

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
