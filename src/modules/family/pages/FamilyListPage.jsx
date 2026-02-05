import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserModal from "../../user/components/UserModal";
import FamilyMemberCard from "./FamilyMemberCard";
import { useModal } from "../../../hooks/useModal";
import { useUserActions } from "../../user/hooks/useUserActions";
import { createFamily, getFamilyMembers, getUserFamilies } from "../firebase/familyQueries";
import { useSelector } from 'react-redux';

export default function FamilyListPage() {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [familyId, setFamilyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, openModal, closeModal } = useModal();
  const { createUser, sendPasswordReset } = useUserActions();
  const { uid: currentUserId } = useSelector(state => state.auth);

  // Inicializar familia al cargar
  useEffect(() => {
    const initializeFamily = async () => {
      if (!currentUserId) return;
      
      // 1. Verificar si el usuario ya tiene familias
      const userFamiliesResult = await getUserFamilies(currentUserId);
      
      if (userFamiliesResult.ok && userFamiliesResult.families.length > 0) {
        // Ya tiene familias, usar la primera
        const firstFamily = userFamiliesResult.families[0];
        setFamilyId(firstFamily.id);
        loadFamilyMembers(firstFamily.id);
      } else {
        // No tiene familias, crear una nueva
        const result = await createFamily({ name: 'Mi Familia' }, currentUserId);
        
        if (result.ok) {
          setFamilyId(result.familyId);
          loadFamilyMembers(result.familyId);
        }
      }
      
      setLoading(false);
    };
    
    initializeFamily();
  }, [currentUserId]);

  const loadFamilyMembers = async (fId) => {
    const result = await getFamilyMembers(fId);
    if (result.ok) {
      setMembers(result.members);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.relation?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMember = async (memberData) => {
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
        onPasswordReset={sendPasswordReset}
      />
    </div>
  );
}