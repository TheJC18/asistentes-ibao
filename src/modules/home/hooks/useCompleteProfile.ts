import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '@/core/context/LanguageContext';
import { startUpdateProfileCompleted } from '@/modules/auth/store';
import { updateUserInFirebase } from '@/modules/user/firebase/userQueries';
import { sendPasswordResetEmailToUser } from '@/modules/auth/firebase/authQueries';
import { showSuccessAlert, showErrorAlert, showLoadingAlert, closeAlert } from '@/core/helpers/sweetAlertHelper';
import { RootState, AppDispatch } from '@/core/store';
import { CompleteProfileHookResult, CompleteProfileUser } from '../types';

export function useCompleteProfile(): CompleteProfileHookResult {
  const dispatch = useDispatch<AppDispatch>();
  const { uid, displayName, email, photoURL, profileCompleted } = useSelector((state: RootState) => state.auth);
  const translate = useTranslation();
  const [showModal, setShowModal] = useState(false);

  // Si el perfil ya está completado o aún no se ha verificado (null), no mostrar nada
  const shouldShow = profileCompleted === false;

  const currentUser: CompleteProfileUser = {
    uid: uid || '',
    displayName: displayName || '',
    email: email || '',
    photoURL: photoURL || '',
    avatar: photoURL || '',
    name: displayName || '',
  };

  const handleCompleteProfile = () => {
    setShowModal(true);
  };

  const handleSaveProfile = async (userData: any) => {
    try {
      showLoadingAlert(translate.pages.home.savingProfile, translate.pages.home.pleaseWait);
      const result = await updateUserInFirebase(uid || '', userData);
      if (result.ok) {
        await dispatch(startUpdateProfileCompleted({ uid: uid || '', profileCompleted: true }));
        closeAlert();
        await showSuccessAlert(
          translate.pages.home.profileCompleted,
          translate.pages.home.profileCompletedMessage
        );
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

  return {
    shouldShow,
    showModal,
    setShowModal,
    handleCompleteProfile,
    handleSaveProfile,
    handlePasswordReset,
    currentUser,
    translate,
  };
}
