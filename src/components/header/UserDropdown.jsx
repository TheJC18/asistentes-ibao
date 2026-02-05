import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { startLogOut } from '../../modules/auth/store';
import UserModal from '../../modules/user/components/UserModal';
import { updateUserInFirebase } from '../../modules/user/firebase/userQueries';
import { showToast, showErrorAlert } from '../../helpers/sweetAlertHelper';

const UserDropdown = ({ displayName, email, photoURL, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const dispatch = useDispatch();
  
  // Obtener datos completos del usuario desde el store
  const { uid, birthdate, nationality, isMember } = useSelector((state) => state.auth);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleLogout() {
    dispatch(startLogOut());
    closeDropdown();
  }
  
  function handleEditProfile() {
    setShowEditModal(true);
    closeDropdown();
  }
  
  async function handleSaveProfile(data) {
    try {
      const result = await updateUserInFirebase(uid, data);
      
      if (result.ok) {
        showToast('success', 'Perfil actualizado correctamente');
        setShowEditModal(false);
        // Recargar la página para actualizar los datos en el header
        window.location.reload();
      } else {
        showErrorAlert(
          'Error al guardar',
          result.errorMessage || 'No se pudo actualizar el perfil'
        );
      }
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      showErrorAlert(
        'Error al guardar',
        'Ocurrió un error al actualizar el perfil'
      );
    }
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 border">
          <img src={ photoURL || "/user_default.png" } alt="User" />
        </span>
        <span className="block mr-1 font-medium text-theme-sm">{displayName || "Usuario"}</span>
        <FontAwesomeIcon
          icon={["fas", "chevron-down"]}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } text-gray-500 dark:text-gray-400`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="font-medium text-gray-700 text-theme-sm dark:text-gray-400 flex items-center gap-2">
            <FontAwesomeIcon icon={["fas", role === "admin" ? "crown" : "user"]} />
            {displayName || "Usuario"}
          </span>
          <span className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <FontAwesomeIcon icon={["fas", "at"]} />
            {email || "Sin email"}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 w-full text-left"
            >
              <FontAwesomeIcon icon={["fas", "user"]} className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Editar mi perfil
            </button>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/support"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <FontAwesomeIcon icon={["fas", "circle-question"]} className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Soporte
            </DropdownItem>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 w-full"
        >
          <FontAwesomeIcon icon={["fas", "right-from-bracket"]} className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          Cerrar sesión
        </button>
      </Dropdown>
      
      {/* Modal de edición de perfil */}
      <UserModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        mode="edit"
        user={{
          id: uid,
          uid,
          name: displayName,
          displayName,
          email,
          avatar: photoURL,
          photoURL,
          role,
          birthdate,
          nationality,
          isMember
        }}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default UserDropdown;