import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserModal from "../../user/components/UserModal";
import FamilyMemberCard from "./FamilyMemberCard";
import { useModal } from "../../../hooks/useModal";
import { useUserActions } from "../../user/hooks/useUserActions";
import { createFamily, getFamilyMembers, getUserFamilies } from "../firebase/familyQueries";
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface FamilyData {
  id: string;
  createdBy: string;
  name?: string;
  [key: string]: any;
}

interface MemberData {
  id: string;
  name: string;
  relation?: string;
  [key: string]: any;
}

export default function FamilyListPage() {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<MemberData[]>([]);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, openModal, closeModal } = useModal();
  const { createUser, sendPasswordReset } = useUserActions();
  const { uid: currentUserId } = useSelector((state: RootState) => state.auth);

  // Inicializar familia al cargar
  useEffect(() => {
    const initializeFamily = async () => {
      if (!currentUserId) return;
      
      // 1. Verificar si el usuario ya tiene familias
      const userFamiliesResult = await getUserFamilies(currentUserId);
      
      if (userFamiliesResult.ok && userFamiliesResult.families.length > 0) {
        // Buscar si tiene una familia que ÉL creó (donde es el createdBy)
        const ownFamily = userFamiliesResult.families.find((fam: FamilyData) => fam.createdBy === currentUserId);
        
        if (ownFamily) {
          // Ya tiene su propia familia
          setFamilyId(ownFamily.id);
          loadFamilyMembers(ownFamily.id);
        } else {
          // Está en familias de otros, pero no tiene la suya propia
          // Crear su familia y establecer relaciones bidireccionales
          const result = await createFamily({ name: 'Mi Familia' }, currentUserId);
          
          if (result.ok && result.familyId) {
            setFamilyId(result.familyId);
            
            // Establecer relaciones bidireccionales con los que lo agregaron
            await setupBidirectionalRelations(result.familyId, userFamiliesResult.families);
            
            loadFamilyMembers(result.familyId);
          } 
        }
      } else {
        // No tiene familias, crear una nueva
        const result = await createFamily({ name: 'Mi Familia' }, currentUserId);
        
        if (result.ok && result.familyId) {
          setFamilyId(result.familyId);
          loadFamilyMembers(result.familyId);
        }
      }
      
      setLoading(false);
    };
    
    initializeFamily();
  }, [currentUserId]);

  // Establecer relaciones bidireccionales para usuarios que fueron agregados como familiares
  const setupBidirectionalRelations = async (myFamilyId: string, otherFamilies: FamilyData[]) => {
    try {
      const { getFamilyMembers, addUserToFamily, getUserById } = await import('../firebase/familyQueries');
      const { getInverseRelation } = await import('../../../helpers');
      
      // Por cada familia ajena donde estoy (familias donde NO soy el creador)
      for (const otherFamily of otherFamilies) {
        if (otherFamily.createdBy === currentUserId) continue; // Saltar mi propia familia
        
        // Obtener los miembros de esa familia
        const otherFamilyMembersResult = await getFamilyMembers(otherFamily.id);
        if (!otherFamilyMembersResult.ok) continue;
        
        // Buscar mi entrada en esa familia para obtener mi relación
        const myEntryInOtherFamily = otherFamilyMembersResult.members.find(m => m.id === currentUserId);
        if (!myEntryInOtherFamily || !myEntryInOtherFamily.relation) continue;
        
        // El creador de esa familia es quien me agregó
        const whoAddedMe = otherFamily.createdBy;
        
        // Obtener datos del creador para obtener su género
        const creatorData = await getUserById(whoAddedMe);
        if (!creatorData.ok || !creatorData.user) continue;
        
        // Calcular la relación inversa según el género del creador
        const creatorGender = creatorData.user.gender || 'male';
        const inverseRelation = getInverseRelation(myEntryInOtherFamily.relation, creatorGender);
        
        // Verificar si el creador ya está en mi familia
        const myFamilyMembersResult = await getFamilyMembers(myFamilyId);
        const creatorAlreadyInMyFamily = myFamilyMembersResult.members?.some(m => m.id === whoAddedMe);
        
        if (!creatorAlreadyInMyFamily) {
          // Agregar al creador a MI familia con la relación inversa
          await addUserToFamily(myFamilyId, whoAddedMe, {
            relation: inverseRelation,
            role: 'member',
            addedBy: currentUserId || ''
          });
        }
      }
    } catch (error) {
      console.error('Error estableciendo relaciones bidireccionales:', error);
    }
  };

  const loadFamilyMembers = async (fId: string) => {
    const result = await getFamilyMembers(fId);
    if (result.ok) {
      setMembers(result.members);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.relation?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMember = async (memberData: any) => {
    if (!familyId) {
      console.error('No hay familia creada');
      return;
    }
    
    // Agregar familyId y createdBy al memberData
    const dataWithFamily = {
      ...memberData,
      familyId,
      createdBy: currentUserId
    };
    
    // Usar el flujo normal de creación de usuarios
    const result = await createUser(dataWithFamily);
    
    if (result.ok) {
      // Recargar miembros de la familia
      await loadFamilyMembers(familyId);
      closeModal();
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[80vh]">
      <div className="text-xl">Cargando familia...</div>
    </div>;
  }

  return (
    <div className="relative min-h-[80vh]">
      <div className="p-4 md:p-6">
        <h2 className="text-4xl font-extrabold mb-8 text-black dark:text-white text-center drop-shadow">
          <FontAwesomeIcon icon={["fas", "users"]} className="text-blue-700 px-3" />
          Mi Familia
        </h2>
        <input
          className="mb-10 w-full rounded-xl border border-gray-300 px-5 py-4 text-lg focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 dark:text-white/90 dark:border-gray-600 shadow-sm"
          placeholder="Buscar miembro, relación..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
          {filteredMembers.map(member => (
            <FamilyMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
      {/* Botón flotante para agregar */}
      <button
        className="fixed bottom-15 right-2 z-5 bg-blue-400 hover:bg-blue-700 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-2xl transition-all text-4xl dark:border-gray-900 hover:scale-110 hover:rotate-6 opacity-60 hover:opacity-100"
        title="Agregar miembro de la familia"
        onClick={openModal}
      >
        <FontAwesomeIcon icon={["fas", "plus"]} />
      </button>
      {/* Modal para crear nuevo integrante */}
      <UserModal 
        open={isOpen} 
        onClose={closeModal} 
        mode="family"
        onSave={handleAddMember}
      />
    </div>
  );
}
