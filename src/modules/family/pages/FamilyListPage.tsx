import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserModal from "@/modules/user/components/UserModal";
import FamilyMemberCard from "./FamilyMemberCard";
import AddFamilyMemberModal from "./AddFamilyMemberModal";
import FloatingActionButtons, { FloatingActionButton } from "@/core/components/ui/FloatingActionButtons";
import { useModal } from "@/core/hooks/useModal";
import { useUserActions } from "@/modules/user/hooks/useUserActions";
import { createFamily, getFamilyMembers, getUserFamilies } from "@/modules/family/firebase/familyQueries";
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { useTranslation } from '@/core/context/LanguageContext';
import { ROLES } from '@/core/constants/roles';

interface FamilyData {
  id: string;
  createdBy: string;
  name?: string;
  [key: string]: any;
}

interface MemberData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  birthdate: string;
  age: number | string;
  phone: string;
  type: string;
  relation?: string;
  gender?: string;
  [key: string]: any;
}

export default function FamilyListPage() {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<MemberData[]>([]);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpen: isCreateModalOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
  const { isOpen: isAddModalOpen, openModal: openAddModal, closeModal: closeAddModal } = useModal();
  const { createUser } = useUserActions();
  const { uid: currentUserId } = useSelector((state: RootState) => state.auth);
  const translate = useTranslation();

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
      const { getFamilyMembers, addUserToFamily, getUserById } = await import('@/modules/family/firebase/familyQueries');
      const { getInverseRelation } = await import('@/core/helpers');
      
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
            role: ROLES.MEMBER,
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

  const handleCreateMember = async (memberData: any) => {
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
      closeCreateModal();
    }
  };

  const handleMemberAdded = async () => {
    if (familyId) {
      await loadFamilyMembers(familyId);
    }
  };

  const handleMemberDeleted = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

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
      
      {/* Modal para crear nuevo integrante */}
      <UserModal 
        open={isCreateModalOpen} 
        onClose={closeCreateModal} 
        mode="family"
        onSave={handleCreateMember}
      />
      
      {/* Modal para agregar usuario existente */}
      {familyId && currentUserId && (
        <AddFamilyMemberModal
          open={isAddModalOpen}
          onClose={closeAddModal}
          familyId={familyId}
          currentUserId={currentUserId}
          onMemberAdded={handleMemberAdded}
        />
      )}
    </div>
  );
}
