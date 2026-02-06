import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '@/core/context/LanguageContext';
import { DropdownItem } from '@/core/components/ui/dropdown/DropdownItem';
import { Dropdown } from '@/core/components/ui/dropdown/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { startLogOut } from '@/modules/auth/store';
import UserModal from '@/modules/user/components/UserModal';
import { updateUserInFirebase } from '@/modules/user/firebase/userQueries';
import { showToast, showErrorAlert, showSuccessAlert } from '@/core/helpers/sweetAlertHelper';
import { sendPasswordResetEmailToUser } from '@/modules/auth/firebase/authQueries';
import { RootState, AppDispatch } from '@/core/store';

interface UserDropdownProps {
  displayName: string;
  email: string;
  photoURL: string;
  role: string;
  uid: string;
}

const UserDropdown = ({ displayName, email, photoURL, role }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const translate = useTranslation();
  
  // Obtener datos del usuario desde el store (ya hidratado en login)
  const {
    uid,
    birthdate,
    nationality,
    isMember,
    name,
    avatar,
    phone,
    gender,
    relation,
    hasWebAccess,
  } = useSelector((state: RootState) => state.auth);

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
  
  async function handleSaveProfile(data: any) {
    try {
      const result = await updateUserInFirebase(uid || '', data);
      
      if (result.ok) {
        showToast('success', translate.common.profileUpdated);
        setShowEditModal(false);
        // Recargar la página para actualizar los datos en el header
        window.location.reload();
      } else {
        showErrorAlert(
          translate.pages.home.errorSaving,
          result.errorMessage || translate.common.errorUpdatingProfile
        );
      }
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      showErrorAlert(
        translate.pages.home.errorSaving,
        translate.common.unexpectedErrorProfile
      );
    }
  }
  
  async function handlePasswordReset(email: string) {
    try {
      const result = await sendPasswordResetEmailToUser(email);
      
      if (result.ok) {
        showSuccessAlert(
          translate.common.emailSent,
          translate.common.emailSentMessage.replace('{email}', email)
        );
      } else {
        showErrorAlert(
          'Error',
          result.errorMessage || translate.common.errorSendingEmail
        );
      }
    } catch (error) {
      console.error('Error al enviar email:', error);
      showErrorAlert(
        'Error',
        translate.common.unexpectedEmailError
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
          <img src={photoURL || "/user_default.png"} alt="User" />
        </span>
        <span className="block mr-1 font-medium text-theme-sm">{displayName || translate.common.user}</span>
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
            {displayName || translate.common.user}
          </span>
          <span className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <FontAwesomeIcon icon={["fas", "at"]} />
            {email || translate.common.noEmail}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 w-full text-left"
            >
              <FontAwesomeIcon icon={["fas", "user"]} className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              {translate.common.editProfile}
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
              {translate.common.support}
            </DropdownItem>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 w-full"
        >
          <FontAwesomeIcon icon={["fas", "right-from-bracket"]} className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          {translate.auth.logout}
        </button>
      </Dropdown>
      
      {/* Modal de edición de perfil */}
      <UserModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        mode="edit"
        user={{
          id: uid || '',
          uid: uid || '',
          name: name || displayName,
          displayName: displayName,
          email: email,
          avatar: avatar || photoURL,
          photoURL: photoURL,
          role: role,
          birthdate: birthdate || '',
          nationality: nationality || '',
          isMember: isMember || false,
          gender: gender || '',
          phone: phone || '',
          relation: relation || '',
          hasWebAccess: hasWebAccess ?? false,
        }}
        onSave={handleSaveProfile}
        onPasswordReset={handlePasswordReset}
      />
    </div>
  );
};

export default UserDropdown;
