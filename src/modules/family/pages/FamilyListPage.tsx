import { useState, lazy, Suspense } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FamilyMemberCard from "./FamilyMemberCard";
import FloatingActionButtons from "@/core/components/ui/FloatingActionButtons";
import { useSidebar } from "@/core/context/SidebarContext";
import { useModal } from "@/core/hooks/useModal";
import { useUserActions } from "@/modules/user/hooks/useUserActions";
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { useTranslation } from '@/core/context/LanguageContext';
import { useFamilyList } from '../hooks/useFamilyList';
import { useFilteredFamilyMembers } from '../hooks/useFamilyList';
const UserModal = lazy(() => import('@/modules/user/components/UserModal'));
const AddFamilyMemberModal = lazy(() => import('./AddFamilyMemberModal'));

export default function FamilyListPage() {
  const sidebar = useSidebar();
  const [search, setSearch] = useState("");
  const { isOpen: isCreateModalOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
  const { isOpen: isAddModalOpen, openModal: openAddModal, closeModal: closeAddModal } = useModal();
  const { createUser } = useUserActions();
  const { uid: currentUserId } = useSelector((state: RootState) => state.auth);
  const translate = useTranslation();
  const {
    members,
    setMembers,
    familyId,
    loading,
    removeMember,
    updateMember,
    reloadMembers,
    createFamilyMember,
    handleMemberAdded,
    handleMemberDeleted,
  } = useFamilyList({ currentUserId });

  const filteredMembers = useFilteredFamilyMembers(members, search);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[80vh]">
      <div className="text-xl">{translate.common.loading}</div>
    </div>;
  }

  return (
    <div className="relative min-h-[80vh]">
      <div className="p-4 md:p-6">
        {/* Header con icono centrado - mismo estilo que otras páginas */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon icon={["fas", "users"]} className="text-primary text-3xl" />
            <h2 className="text-3xl font-bold text-text-primary">{translate.pages.family.title}</h2>
          </div>
        </div>
        
        {/* Buscador */}
        <input
          className="mb-10 w-full rounded-xl border border-border px-5 py-4 text-lg focus:ring-2 focus:ring-primary bg-background text-text-primary shadow-sm"
          placeholder={translate.pages.family.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
          {filteredMembers.map(member => (
            <FamilyMemberCard 
              key={member.id} 
              member={member} 
              familyId={familyId || undefined}
              onMemberUpdate={(updatedMember) => {
                setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
              }}
              onMemberDelete={handleMemberDeleted}
            />
          ))}
        </div>
      </div>
      
      {/* Botones flotantes */}
      {!(sidebar && sidebar.isMobileOpen) && (
        <FloatingActionButtons 
          buttons={[
            {
              icon: ["fas", "user-plus"],
              onClick: openAddModal,
              title: translate.pages.family.addFamiliar,
              tooltip: translate.pages.family.addFamiliar,
              color: "green"
            },
            {
              icon: ["fas", "plus"],
              onClick: openCreateModal,
              title: translate.pages.family.addMember,
              tooltip: translate.pages.family.addMember,
              color: "blue"
            }
          ]}
        />
      )}
      
      {/* Modal para crear nuevo integrante */}
      <Suspense fallback={<div className="flex justify-center items-center min-h-[20vh]"><span className="text-lg">Cargando modal...</span></div>}>
        <UserModal 
          open={isCreateModalOpen} 
          onClose={closeCreateModal} 
          mode="family"
          onSave={(memberData: any) => createFamilyMember(memberData, createUser, closeCreateModal, currentUserId)}
        />
      </Suspense>
      
      {/* Modal para agregar usuario existente */}
      <Suspense fallback={<div className="flex justify-center items-center min-h-[20vh]"><span className="text-lg">Cargando modal...</span></div>}>
        {familyId && currentUserId && (
          <AddFamilyMemberModal
            open={isAddModalOpen}
            onClose={closeAddModal}
            familyId={familyId}
            currentUserId={currentUserId}
            onMemberAdded={handleMemberAdded}
          />
        )}
      </Suspense>
    </div>
  );
}
