import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserCard } from '@/core/components/common';
import UserModal from '@/modules/user/components/UserModal';
import { useTranslation } from '@/core/context/LanguageContext';
import { FamilyMemberCardProps } from '../types';
import { useFamilyMemberCard } from '../hooks/useFamilyMemberCard';

export default function FamilyMemberCard({ 
  member, 
  familyId, 
  onMemberUpdate,
  onMemberDelete 
}: FamilyMemberCardProps) {
  const translate = useTranslation();
  const {
    isEditModalOpen,
    setIsEditModalOpen,
    handleEditClick,
    handleSaveEdit,
    handleDeleteClick,
  } = useFamilyMemberCard({ member, familyId, onMemberUpdate, onMemberDelete, translate });

  return (
    <>
      <div className="relative group">
        <UserCard 
          user={member} 
          showRelation={true}
          showPhone={true}
          showNationality={true}
        />

        {/* Botón de editar (izquierda superior) */}
        <button
          onClick={handleEditClick}
          className="absolute top-4 left-4 z-10 p-2 rounded-lg bg-success hover:bg-success/80 text-text-on-primary transition shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
          title={translate.pages.family.editMember}
          aria-label={translate.pages.family.editMember}
        >
          <FontAwesomeIcon icon={["fas", "edit"]} className="text-lg" />
        </button>
        
        {/* Botón de eliminar (derecha superior) */}
        <button
          onClick={handleDeleteClick}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-error hover:bg-error/80 text-text-on-primary transition shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
          title={translate.pages.family.deleteMember}
          aria-label={translate.pages.family.deleteMember}
        >
          <FontAwesomeIcon icon={["fas", "trash"]} className="text-lg" />
        </button>
      </div>

      {/* Modal reutilizando el mismo que usuarios */}
      <UserModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        user={{
          ...member,
          role: member.role as import('@/core/constants/roles').RoleType,
          gender: (member.gender === 'male' || member.gender === 'female' || member.gender === 'other' || member.gender === 'neutral')
            ? member.gender
            : 'other',
        }}
        onSave={handleSaveEdit}
      />
    </>
  );
}