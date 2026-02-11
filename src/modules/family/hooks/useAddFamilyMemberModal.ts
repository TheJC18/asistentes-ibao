import { useState, useEffect, useCallback } from 'react';
import { searchUsersToAddToFamily, addUserToFamily } from '@/modules/family/firebase/familyQueries';
import { ROLES } from '@/core/constants/roles';
import { showSuccessAlert, showErrorAlert } from '@/core/helpers/sweetAlertHelper';
import { UseAddFamilyMemberModalProps } from '@/modules/family/types';
import type { User } from '@/types';

export function useAddFamilyMemberModal({
  open,
  familyId,
  currentUserId,
  onMemberAdded,
  translate,
  relations
}: UseAddFamilyMemberModalProps) {
  const [search, setSearch] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRelation, setSelectedRelation] = useState('');

  useEffect(() => {
    if (open) {
      loadAvailableUsers();
    } else {
      setSearch('');
      setSelectedUser(null);
      setSelectedRelation('');
    }
    // eslint-disable-next-line
  }, [open, familyId]);

  const loadAvailableUsers = useCallback(async (searchTerm: string = '') => {
    setLoading(true);
    const result = await searchUsersToAddToFamily(familyId, searchTerm);
    if (result.ok) {
      setAvailableUsers(result.users);
    }
    setLoading(false);
  }, [familyId]);

  const handleSearch = (value: string) => {
    setSearch(value);
    loadAvailableUsers(value);
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleAddToFamily = async () => {
    if (!selectedUser || !selectedRelation) {
      await showErrorAlert(translate.messages?.error?.generic, translate.messages?.error?.required);
      return;
    }
    const result = await addUserToFamily(familyId, selectedUser.id, {
      relation: selectedRelation,
      role: ROLES.USER,
      addedBy: currentUserId
    });
    if (result.ok) {
      await showSuccessAlert(translate.messages?.success?.added, `${selectedUser.name} ${translate.messages?.success?.addedToFamily}`);
      if (onMemberAdded) {
        onMemberAdded();
      }
      return true;
    } else {
      await showErrorAlert(translate.messages?.error?.generic, result.errorMessage || translate.messages?.error?.addUserFailed);
      return false;
    }
  };

  return {
    search,
    setSearch,
    availableUsers,
    loading,
    selectedUser,
    setSelectedUser: handleSelectUser,
    selectedRelation,
    setSelectedRelation,
    handleSearch,
    handleAddToFamily,
    relations,
  };
}
