import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserCard } from '../../../components/common';
import UserModal from '../../user/components/UserModal';
import { useUserActions } from '../../user/hooks/useUserActions';
import { updateFamilyMember } from '../firebase/familyQueries';

interface FamilyMemberCardProps {
  member: any;
  familyId?: string;
  onMemberUpdate?: (updatedMember: any) => void;
}

export default function FamilyMemberCard({ 
  member, 
  familyId, 
  onMemberUpdate 
}: FamilyMemberCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { updateUser } = useUserActions();

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (editedData: any) => {
    // Separar relación de datos de usuario
    const { relation, ...userData } = editedData;
    
    // Actualizar datos del usuario (muestra toast automáticamente vía hook)
    const result = await updateUser(member.id, userData);
    
    if (result.ok) {
      // Si la relación cambió, actualizar en familia también
      if (relation && familyId && relation !== member.relation) {
        await updateFamilyMember(familyId, member.id, { relation });
      }
      
      // Actualizar estado local si hay callback
      if (onMemberUpdate) {
        onMemberUpdate({ ...member, ...editedData });
      }
      
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClick = () => {
    // TODO: Implementar eliminación de familiar
    console.log('Eliminar familiar:', member.id);
  };

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
          className="absolute top-4 left-4 z-10 p-2 rounded-lg bg-green-500/90 hover:bg-green-600 text-white transition shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
          title="Editar familiar"
          aria-label="Editar información del familiar"
        >
          <FontAwesomeIcon icon={["fas", "edit"]} className="text-lg" />
        </button>
        
        {/* Botón de eliminar (derecha superior) */}
        <button
          onClick={handleDeleteClick}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-red-500/90 hover:bg-red-600 text-white transition shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
          title="Eliminar de mi familia"
          aria-label="Eliminar familiar de mi familia"
        >
          <FontAwesomeIcon icon={["fas", "trash"]} className="text-lg" />
        </button>
      </div>

      {/* Modal reutilizando el mismo que usuarios */}
      <UserModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        user={member}
        onSave={handleSaveEdit}
      />
    </>
  );
}