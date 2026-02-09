import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '@/core/context/LanguageContext';
import { useTheme } from '@/core/context/ThemeContext';
import { useLanguage } from '@/core/context/LanguageContext';
import { DropdownItem } from '@/core/components/ui/dropdown/DropdownItem';
import { Dropdown } from '@/core/components/ui/dropdown/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { startLogOut } from '@/modules/auth/store';
import UserModal from '@/modules/user/components/UserModal';
import { updateUserInFirebase } from '@/modules/user/firebase/userQueries';
import { showToast, showErrorAlert, showSuccessAlert } from '@/core/helpers/sweetAlertHelper';
import { sendPasswordResetEmailToUser } from '@/modules/auth/firebase/authQueries';
import { getRoleIcon, RoleType, ROLES } from '@/core/constants/roles';
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
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  
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
        className="flex items-center text-text-primary dropdown-toggle"
      >
        <span className="mr-2 lg:mr-3 overflow-hidden rounded-full h-10 w-10 lg:h-11 lg:w-11 border flex-shrink-0">
          <img src={photoURL || "/user_default.png"} alt="User" />
        </span>
        <span className="hidden lg:block mr-1 font-medium text-theme-sm max-w-[150px] xl:max-w-[200px] truncate">
          {displayName || translate.common.user}
        </span>
        <FontAwesomeIcon
          icon={["fas", "chevron-down"]}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } text-text-secondary`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-border bg-card p-3 shadow-theme-lg"
      >
        <div className="min-w-0">
          <span className="font-medium text-text-primary text-theme-sm flex items-center gap-2">
            <FontAwesomeIcon icon={["fas", getRoleIcon(role)]} className="flex-shrink-0" />
            <span className="truncate">{displayName || translate.common.user}</span>
          </span>
          <span className="mt-0.5 text-theme-xs text-text-secondary flex items-center gap-2">
            <FontAwesomeIcon icon={["fas", "at"]} className="flex-shrink-0" />
            <span className="truncate">{email || translate.common.noEmail}</span>
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-border">
          <li>
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-3 px-3 py-2 font-medium text-text-primary rounded-lg group text-theme-sm hover:bg-surface w-full text-left"
            >
              <FontAwesomeIcon icon={["fas", "user"]} className="text-text-secondary group-hover:text-text-primary" />
              {translate.common.editProfile}
            </button>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/support"
              className="flex items-center gap-3 px-3 py-2 font-medium text-text-primary rounded-lg group text-theme-sm hover:bg-surface"
            >
              <FontAwesomeIcon icon={["fas", "circle-question"]} className="text-text-secondary group-hover:text-text-primary" />
              {translate.common.support}
            </DropdownItem>
          </li>
        </ul>

        {/* Configuración */}
        <div className="py-3 border-b border-border">
          <div className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wide">
            {translate.common.settings || 'Configuración'}
          </div>
          
          {/* Selector de Idioma */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={["fas", "language"]} className="text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                {translate.common.language || 'Idioma'}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 text-xs font-medium rounded transition ${
                  language === 'es'
                    ? 'bg-primary text-text-on-primary'
                    : 'bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-medium rounded transition ${
                  language === 'en'
                    ? 'bg-primary text-text-on-primary'
                    : 'bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Selector de Tema */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon 
                icon={["fas", theme === "dark" ? "moon" : "sun"]} 
                className="text-text-secondary" 
              />
              <span className="text-sm font-medium text-text-primary">
                {translate.common.theme || 'Tema'}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-surface-hover"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-text-primary rounded-lg group text-theme-sm hover:bg-surface w-full"
        >
          <FontAwesomeIcon icon={["fas", "right-from-bracket"]} className="text-text-secondary group-hover:text-text-primary" />
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
          email: email,
          avatar: avatar || photoURL,
          photoURL: photoURL,
          role: (role || ROLES.USER) as RoleType,
          birthdate: birthdate || '',
          nationality: nationality || '',
          isMember: isMember || false,
          gender: (gender || 'other') as 'male' | 'female' | 'other' | 'neutral',
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
