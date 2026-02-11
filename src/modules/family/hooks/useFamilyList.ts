import { useState, useEffect, useCallback } from 'react';
import { getUserFamilies, createFamily, getFamilyMembers, addUserToFamily, getUserById } from '@/modules/family/firebase/familyQueries';
import { ROLES } from '@/core/constants/roles';
import { getInverseRelation } from '@/core/helpers';
import { UseFamilyListOptions } from '../types';
import { Family, FamilyMember } from '@/modules/family/types';

export function useFamilyList({ currentUserId }: UseFamilyListOptions) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar miembros de la familia
  const loadFamilyMembers = useCallback(async (fId: string) => {
    const result = await getFamilyMembers(fId);
    if (result.ok) {
      setMembers(result.members);
    }
  }, []);

  // Relaciones bidireccionales
  const setupBidirectionalRelations = useCallback(async (myFamilyId: string, otherFamilies: Family[]) => {
    try {
      for (const otherFamily of otherFamilies) {
        if (otherFamily.createdBy === currentUserId) continue;
        const otherFamilyMembersResult = await getFamilyMembers(otherFamily.id);
        if (!otherFamilyMembersResult.ok) continue;
        const myEntryInOtherFamily = otherFamilyMembersResult.members.find(m => m.id === currentUserId);
        if (!myEntryInOtherFamily || !myEntryInOtherFamily.relation) continue;
        const whoAddedMe = otherFamily.createdBy;
        const creatorData = await getUserById(whoAddedMe);
        if (!creatorData.ok || !creatorData.user) continue;
        const creatorGender = creatorData.user.gender || 'male';
        const inverseRelation = getInverseRelation(myEntryInOtherFamily.relation, creatorGender);
        const myFamilyMembersResult = await getFamilyMembers(myFamilyId);
        const creatorAlreadyInMyFamily = myFamilyMembersResult.members?.some(m => m.id === whoAddedMe);
        if (!creatorAlreadyInMyFamily) {
          await addUserToFamily(myFamilyId, whoAddedMe, {
            relation: inverseRelation,
            role: ROLES.USER,
            addedBy: currentUserId || ''
          });
        }
      }
    } catch (error) {
      console.error('Error estableciendo relaciones bidireccionales:', error);
    }
  }, [currentUserId]);

  // Inicializar familia
  useEffect(() => {
    const initializeFamily = async () => {
      if (!currentUserId) return;
      const userFamiliesResult = await getUserFamilies(currentUserId);
      if (userFamiliesResult.ok && userFamiliesResult.families.length > 0) {
        const ownFamily = userFamiliesResult.families.find((fam: Family) => fam.createdBy === currentUserId);
        if (ownFamily) {
          setFamilyId(ownFamily.id);
          loadFamilyMembers(ownFamily.id);
        } else {
          const result = await createFamily({ name: 'Mi Familia' }, currentUserId);
          if (result.ok && result.familyId) {
            setFamilyId(result.familyId);
            await setupBidirectionalRelations(result.familyId, userFamiliesResult.families);
            loadFamilyMembers(result.familyId);
          }
        }
      } else {
        const result = await createFamily({ name: 'Mi Familia' }, currentUserId);
        if (result.ok && result.familyId) {
          setFamilyId(result.familyId);
          loadFamilyMembers(result.familyId);
        }
      }
      setLoading(false);
    };
    initializeFamily();
  }, [currentUserId, loadFamilyMembers, setupBidirectionalRelations]);

  // Eliminar miembro localmente
  const removeMember = (memberId: string) => {
    setMembers(members => members.filter(m => m.id !== memberId));
  };

  // Actualizar miembro localmente
  const updateMember = (updatedMember: FamilyMember) => {
    setMembers(members => members.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  // Recargar miembros
  const reloadMembers = async () => {
    if (familyId) {
      await loadFamilyMembers(familyId);
    }
  };

  return {
    members,
    setMembers,
    familyId,
    setFamilyId,
    loading,
    loadFamilyMembers,
    removeMember,
    updateMember,
    reloadMembers,
  };
}
