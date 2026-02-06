import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '@/core/context/LanguageContext';
import { startUpdateProfileCompleted } from '@/modules/auth/store';
import UserModal from '@/modules/user/components/UserModal';
import { updateUserInFirebase } from '@/modules/user/firebase/userQueries';
import { sendPasswordResetEmailToUser } from '@/modules/auth/firebase/authQueries';
import { showSuccessAlert, showErrorAlert, showLoadingAlert, closeAlert } from '@/core/helpers/sweetAlertHelper';
import { RootState, AppDispatch } from '@/core/store';

export default function CompleteProfileCard() {
  const dispatch = useDispatch<AppDispatch>();
  const { uid, displayName, email, photoURL, profileCompleted } = useSelector((state: RootState) => state.auth);
  const translate = useTranslation();
  const [showModal, setShowModal] = useState(false);

  // Si el perfil ya está completado o aún no se ha verificado (null), no mostrar nada
  if (profileCompleted !== false) {
    return null;
  }

  const handleCompleteProfile = () => {
    setShowModal(true);
  };

  const handleSaveProfile = async (userData: any) => {
    try {
      // Mostrar loading
      showLoadingAlert(translate.pages.home.savingProfile, translate.pages.home.pleaseWait);

      // Guardar los datos del usuario en Firestore
      const result = await updateUserInFirebase(uid || '', userData);
      
      if (result.ok) {
        // Marcar el perfil como completado
        await dispatch(startUpdateProfileCompleted({ uid: uid || '', profileCompleted: true }));
        
        // Cerrar loading y mostrar éxito
        closeAlert();
        await showSuccessAlert(
          translate.pages.home.profileCompleted,
          translate.pages.home.profileCompletedMessage
        );
        
        // Cerrar el modal
        setShowModal(false);
      } else {
        closeAlert();
        showErrorAlert(
          translate.pages.home.errorSaving,
          result.errorMessage || translate.pages.home.errorSavingMessage
        );
      }
    } catch (error) {
      closeAlert();
      console.error('Error al guardar el perfil:', error);
      showErrorAlert(
        translate.pages.home.unexpectedError,
        translate.pages.home.unexpectedErrorMessage
      );
    }
  };
  
  const handlePasswordReset = async (email: string) => {
    try {
      const result = await sendPasswordResetEmailToUser(email);
      
      if (result.ok) {
        await showSuccessAlert(
          'Email enviado',
          `Se ha enviado un email de restablecimiento a ${email}`
        );
      } else {
        showErrorAlert(
          'Error',
          result.errorMessage || 'No se pudo enviar el email'
        );
      }
    } catch (error) {
      console.error('Error al enviar email:', error);
      showErrorAlert(
        'Error',
        'Ocurrió un error al enviar el email de restablecimiento'
      );
    }
  };

  const currentUser = {
    uid: uid || '',
    displayName: displayName || '',
    email: email || '',
    photoURL: photoURL || '',
    avatar: photoURL || '',
    name: displayName || '',
  };

  return (
    <div className="col-span-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 shadow-xl">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
                  <FontAwesomeIcon 
                    icon={["fas", "user-circle"]} 
                    className="text-2xl text-white"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {translate.pages.home.welcomeUser.replace('{name}', displayName || '')}
                  </h3>
                  <p className="text-sm text-blue-100">
                    {translate.pages.home.completeProfile}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                <p className="text-white text-sm mb-3">
                  {translate.pages.home.completeProfileMessage}
                </p>
                <ul className="space-y-2 text-sm text-white/90">
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={["fas", "check-circle"]} className="text-green-300" />
                    {translate.pages.home.completeProfileItems.birthdate}
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={["fas", "check-circle"]} className="text-green-300" />
                    {translate.pages.home.completeProfileItems.nationality}
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={["fas", "check-circle"]} className="text-green-300" />
                    {translate.pages.home.completeProfileItems.photo}
                  </li>
                </ul>
              </div>

              <button
                onClick={handleCompleteProfile}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={["fas", "edit"]} />
                {translate.pages.home.completeProfileTitle}
              </button>
            </div>

            <div className="hidden md:block">
              <FontAwesomeIcon 
                icon={["fas", "clipboard-check"]} 
                className="text-8xl text-white/10"
              />
            </div>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Modal de completar perfil */}
      <UserModal
        open={showModal}
        onClose={() => setShowModal(false)}
        mode="edit"
        user={currentUser}
        onSave={handleSaveProfile}
        onPasswordReset={handlePasswordReset}
      />
    </div>
  );
}
