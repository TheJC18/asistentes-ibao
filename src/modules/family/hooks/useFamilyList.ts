import { useState, useEffect, useCallback } from 'react';
import { getUserFamilies, createFamily, getFamilyMembers, addUserToFamily, getUserById, getOrCreateFamilyByUserId } from '@/modules/family/firebase/familyQueries';
import { ROLES } from '@/core/helpers/roles';
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
      // Procesar relaciones para que sean correctas según el contexto
      const processedMembers = result.members.map(member => {
        if (member.relation && [
          'parent', 'child', 'grandparent', 'grandchild'
        ].includes(member.relation)) {
          // Invertir la relación según el género del usuario actual
          const inverseRelation = getInverseRelation(member.relation, member.gender);
          return { ...member, relation: inverseRelation };
        }
        return member;
      });
      setMembers(processedMembers);
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
      const { ok, familyId } = await getOrCreateFamilyByUserId(currentUserId);
      if (ok && familyId) {
        setFamilyId(familyId);
        loadFamilyMembers(familyId);
      }
      setLoading(false);
    };
    initializeFamily();
  }, [currentUserId, loadFamilyMembers]);

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

  // Crear miembro en la familia
  const createFamilyMember = async (memberData: any, createUser: (data: any) => Promise<any>, closeCreateModal: () => void, currentUserId: string | undefined) => {
    if (!familyId) {
      console.error('No hay familia creada');
      return;
    }
    const dataWithFamily = {
      ...memberData,
      familyId,
      createdBy: currentUserId
    };
    const result = await createUser(dataWithFamily);
    if (result.ok) {
      await reloadMembers();
      closeCreateModal();
    }
  };

  // Handler para cuando se agrega un miembro
  const handleMemberAdded = async () => {
    await reloadMembers();
  };

  // Handler para eliminar miembro
  const handleMemberDeleted = (memberId: string) => {
    removeMember(memberId);
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
    createFamilyMember,
    handleMemberAdded,
    handleMemberDeleted,
  };
}

// Filtrar miembros por nombre o relación
export function useFilteredFamilyMembers(members: FamilyMember[], search: string) {
  return members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.relation?.toLowerCase().includes(search.toLowerCase())
  );
}
