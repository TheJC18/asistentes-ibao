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
import { ROLES } from '@/core/constants/roles';

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
      onClose();
    } else {
      await showErrorAlert(translate.messages?.error?.generic, result.errorMessage || translate.messages?.error?.addUserFailed);
    }
  };

  if (!open) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    return null;
  }
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-5xl bg-card rounded-2xl shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={["fas", "user-plus"]} className="text-primary text-2xl" />
              <h2 className="text-2xl font-bold text-text-primary">
                {translate.pages.family.addFamiliar}
              </h2>
            </div>
            <button
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface"
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
              className="w-full rounded-xl border border-border px-5 py-4 text-lg focus:ring-2 focus:ring-primary bg-background text-text-primary shadow-sm"
              placeholder={translate.pages?.family?.searchPlaceholder || "Buscar usuarios disponibles..."}
            />
          </div>

          {/* Lista de usuarios */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="text-center py-8 text-text-secondary">{translate.common?.loading}</div>
            ) : (
              availableUsers.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">{translate.pages?.family?.noUsersFound}</div>
              ) : (
                availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`relative cursor-pointer transition-all ${
                      selectedUser?.id === user.id
                        ? 'ring-2 ring-primary shadow-lg'
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
                ))
              )
            )}
          </div>

          {/* Relación */}
          {selectedUser && (
            <div className="mb-6">
              <Label htmlFor="relation">{translate.form?.relation}</Label>
              <Select
                id="relation"
                value={selectedRelation}
                onChange={setSelectedRelation}
                options={Object.entries(relations).map(([key, value]) => ({ value: key, label: String(value) }))}
                placeholder={translate.form?.relationPlaceholder}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-border flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-border text-text-primary hover:bg-surface"
          >
            {translate.common.cancel}
          </button>
          <button
            onClick={handleAddToFamily}
            disabled={!selectedUser || !selectedRelation}
            className="px-6 py-2 rounded-lg bg-primary text-text-on-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={["fas", "user-plus"]} className="mr-2" />
            {translate.pages?.family?.addFamiliar}
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
