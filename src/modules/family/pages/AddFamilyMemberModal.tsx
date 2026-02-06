import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserCard } from '@/core/components/common';
import Select from '@/core/components/form/Select';
import Label from '@/core/components/form/Label';
import { searchUsersToAddToFamily, addUserToFamily } from '@/modules/family/firebase/familyQueries';
import { relationsES, relationsEN } from '@/i18n/relations';
import { useLanguage } from '@/core/context/LanguageContext';
import { showSuccessAlert, showErrorAlert } from '@/core/helpers/sweetAlertHelper';
import { useTranslation } from '@/core/context/LanguageContext';

interface AddFamilyMemberModalProps {
  open: boolean;
  onClose: () => void;
  familyId: string;
  currentUserId: string;
  onMemberAdded?: () => void;
}

export default function AddFamilyMemberModal({
  open,
  onClose,
  familyId,
  currentUserId,
  onMemberAdded
}: AddFamilyMemberModalProps) {
  const { language } = useLanguage();
  const translate = useTranslation();
  const relations = language === "es" ? relationsES : relationsEN;

  const [search, setSearch] = useState('');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedRelation, setSelectedRelation] = useState('');

  useEffect(() => {
    if (open) {
      loadAvailableUsers();
    } else {
      // Reset al cerrar
      setSearch('');
      setSelectedUser(null);
      setSelectedRelation('');
    }
  }, [open, familyId]);

  const loadAvailableUsers = async (searchTerm: string = '') => {
    setLoading(true);
    const result = await searchUsersToAddToFamily(familyId, searchTerm);
    if (result.ok) {
      setAvailableUsers(result.users);
    }
    setLoading(false);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    loadAvailableUsers(value);
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
  };

  const handleAddToFamily = async () => {
    if (!selectedUser || !selectedRelation) {
      await showErrorAlert('Error', 'Por favor selecciona un usuario y una relación');
      return;
    }

    const result = await addUserToFamily(familyId, selectedUser.id, {
      relation: selectedRelation,
      role: 'member',
      addedBy: currentUserId
    });

    if (result.ok) {
      await showSuccessAlert('¡Agregado!', `${selectedUser.name} ha sido agregado a tu familia`);
      
      if (onMemberAdded) {
        onMemberAdded();
      }
      
      onClose();
    } else {
      await showErrorAlert('Error', result.errorMessage || 'No se pudo agregar el usuario');
    }
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={["fas", "user-plus"]} className="text-brand-600 dark:text-brand-400 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {translate.pages.family.addFamiliar}
              </h2>
            </div>
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={["fas", "times"]} className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-6">
          {/* Buscador */}
          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-xl border px-5 py-4 text-lg focus:ring-2 focus:ring-brand-400 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700 shadow-sm"
              placeholder="Buscar usuarios disponibles..."
            />
          </div>

          {/* Usuario seleccionado y relación */}
          {selectedUser && (
            <div className="mb-6 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-lg border border-brand-200 dark:border-brand-700">
              <div className="flex items-start gap-4">
                <img
                  src={selectedUser.avatar || selectedUser.photoURL || '/user_default.png'}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-brand-500"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {selectedUser.name}
                  </h3>
                  <div className="max-w-xs">
                    <Label htmlFor="relation">
                      Selecciona la relación <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={relations.map(r => ({ value: r.code, label: r.name }))}
                      placeholder="¿Quién es?"
                      onChange={(value: string) => setSelectedRelation(value)}
                      defaultValue={selectedRelation}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <FontAwesomeIcon icon={["fas", "times"]} />
                </button>
              </div>
            </div>
          )}

          {/* Lista de usuarios disponibles */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
              </div>
            ) : availableUsers.length === 0 ? (
              <div className="text-center py-8">
                <FontAwesomeIcon 
                  icon={["fas", "users-slash"]} 
                  className="text-6xl text-gray-400 dark:text-gray-600 mb-4" 
                />
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {search ? 'No se encontraron usuarios' : 'No hay usuarios disponibles para agregar'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2">
                {availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`relative cursor-pointer transition-all ${
                      selectedUser?.id === user.id
                        ? 'ring-2 ring-brand-500 shadow-lg'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleSelectUser(user)}
                  >
                    <UserCard 
                      user={user}
                      showRelation={false}
                      showPhone={false}
                      showNationality={false}
                    />
                    {selectedUser?.id === user.id && (
                      <div className="absolute top-2 right-2 bg-brand-500 text-white rounded-full p-1">
                        <FontAwesomeIcon icon={["fas", "check"]} className="text-sm" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {translate.common.cancel}
          </button>
          <button
            onClick={handleAddToFamily}
            disabled={!selectedUser || !selectedRelation}
            className="px-6 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={["fas", "user-plus"]} className="mr-2" />
            Agregar a mi familia
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
