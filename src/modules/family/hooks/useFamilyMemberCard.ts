import { useState } from 'react';
import { useUserActions } from '@/modules/user/hooks/useUserActions';
import { updateFamilyMember, deleteFamilyMember } from '@/modules/family/firebase/familyQueries';
import { showDeleteConfirmAlert, showSuccessAlert, showErrorAlert } from '@/core/helpers/sweetAlertHelper';
import { FamilyMember, UseFamilyMemberCardProps } from '../types';


export function useFamilyMemberCard({ member, familyId, onMemberUpdate, onMemberDelete, translate }: UseFamilyMemberCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { updateUser } = useUserActions();

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (editedData: FamilyMember) => {
    const { relation, ...userData } = editedData;
    const result = await updateUser(member.id, userData);
    if (result.ok) {
      if (relation && familyId && relation !== member.relation) {
        await updateFamilyMember(familyId, member.id, { relation });
      }
      if (onMemberUpdate) {
        onMemberUpdate({ ...member, ...editedData });
      }
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!familyId) return;
    const result = await showDeleteConfirmAlert(
      translate.pages.family.deleteMember,
      `¿Estás seguro de eliminar a ${member.name} de tu familia?`
    );
    if (result.isConfirmed) {
      const deleteResult = await deleteFamilyMember(familyId, member.id);
      if (deleteResult.ok) {
        await showSuccessAlert(
          translate.messages?.success?.deleted || 'Eliminado',
          deleteResult.message || translate.messages?.success?.deletedFamilyMember
        );
        if (onMemberDelete) {
          onMemberDelete(member.id);
        }
      } else {
        await showErrorAlert(
          translate.messages?.error?.generic,
          deleteResult.errorMessage || translate.messages?.error?.deleteFamilyMemberFailed
        );
      }
    }
  };

  return {
    isEditModalOpen,
    setIsEditModalOpen,
    handleEditClick,
    handleSaveEdit,
    handleDeleteClick,
  };
}
