import { createUserInFirebase, updateUserInFirebase, deleteUserFromFirebase, getUserByIdFromFirebase } from '../firebase/userQueries';
import { cleanupOrphanAuthUser, sendPasswordResetEmailToUser } from '../../auth/firebase/authQueries';
import { showDeleteConfirmAlert, showSuccessAlert, showErrorAlert, showToast } from '../../../helpers/sweetAlertHelper';
import Swal from 'sweetalert2';

/**
 * Hook para manejar las acciones CRUD de usuarios
 * Solo se encarga de las operaciones con Firebase y mostrar mensajes
 */
export const useUserActions = () => {
  /**
   * Crear un nuevo usuario
   */
  const createUser = async (userData) => {
    try {
      const result = await createUserInFirebase(userData);
      
      if (result && result.ok) {
        showToast(
          'success', 
          'Usuario creado correctamente. El usuario puede iniciar sesión con sus credenciales.'
        );
        return { ok: true, user: result.user };
      } 
      
      // Si el error es email duplicado en Authentication
      if (result?.errorCode === 'auth/email-already-in-use' && result?.canCleanup) {
        showErrorAlert(
          '⚠️ Email ya registrado',
          `El correo <strong>${result.email || userData.email}</strong> ya está en uso. Si necesitas eliminarlo, ve al panel de usuarios y elimínalo desde ahí.`
        );
        return { ok: false, errorMessage: 'Email ya registrado' };
      }
      
      // Otros errores
      else {
        showErrorAlert(
          'Error al crear usuario',
          result?.errorMessage || 'No se pudo crear el usuario. Por favor intenta de nuevo.'
        );
        return { ok: false, errorMessage: result?.errorMessage };
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      showErrorAlert(
        'Error al crear',
        'No se pudo crear el usuario. Por favor intenta de nuevo.'
      );
      return { ok: false, errorMessage: error.message };
    }
  };

  /**
   * Actualizar un usuario existente
   */
  const updateUser = async (userId, userData) => {
    try {
      if (!userId) {
        showErrorAlert('Error', 'No se encontró el ID del usuario a actualizar');
        return { ok: false, errorMessage: 'ID de usuario no encontrado' };
      }

      const result = await updateUserInFirebase(userId, userData);
      
      if (result && result.ok) {
        // Si hubo migración de ID (usuario sin acceso → con acceso)
        if (result.migrated && result.oldId && result.newId) {
          showToast('success', `Usuario migrado correctamente. El ID cambió de ${result.oldId.substring(0, 8)}... a ${result.newId.substring(0, 8)}...`);
          
          // IMPORTANTE: Retornar el nuevo ID para que el componente pueda actualizar
          return { 
            ok: true, 
            user: result.user,
            migrated: true,
            oldId: result.oldId,
            newId: result.newId
          };
        }
        
        showToast('success', 'Usuario actualizado correctamente');
        return { ok: true, user: result.user };
      } else {
        showErrorAlert(
          'Error al actualizar',
          result?.errorMessage || 'No se pudo actualizar el usuario. Por favor intenta de nuevo.'
        );
        return { ok: false, errorMessage: result?.errorMessage };
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      showErrorAlert(
        'Error al actualizar',
        'No se pudo actualizar el usuario. Por favor intenta de nuevo.'
      );
      return { ok: false, errorMessage: error.message };
    }
  };

  /**
   * Eliminar un usuario
   */
  const deleteUser = async (userId, userName) => {
    try {
      // 1. Obtener datos del usuario antes de eliminar
      const userResult = await getUserByIdFromFirebase(userId);
      
      if (!userResult.ok) {
        showErrorAlert('Error', 'No se encontró el usuario');
        return { ok: false, errorMessage: 'Usuario no encontrado' };
      }
      
      const user = userResult.user;
      const hasWebAccess = user.hasWebAccess;
      const userEmail = user.email;
      
      // 2. Confirmar eliminación
      const result = await showDeleteConfirmAlert(`el usuario "${userName}"`);

      if (!result.isConfirmed) {
        return { ok: false, cancelled: true };
      }

      // 3. Eliminar de Firestore
      const deleteResult = await deleteUserFromFirebase(userId);
      
      if (!deleteResult.ok) {
        showErrorAlert(
          'Error al eliminar',
          deleteResult?.errorMessage || 'No se pudo eliminar el usuario'
        );
        return { ok: false, errorMessage: deleteResult?.errorMessage };
      }
      
      // 4. Mostrar mensaje apropiado según el tipo de usuario
      if (hasWebAccess && userEmail) {
        showToast('warning', 
          `Usuario eliminado de Firestore. ⚠️ IMPORTANTE: Debes eliminar manualmente "${userEmail}" desde Firebase Console > Authentication para completar la eliminación.`
        );
      } else {
        showToast('success', 'Usuario eliminado correctamente');
      }
      
      return { ok: true };
      
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      showErrorAlert(
        'Error inesperado',
        'Ocurrió un error al intentar eliminar el usuario'
      );
      return { ok: false, errorMessage: error.message };
    }
  };

  /**
   * Enviar email de restablecimiento de contraseña
   */
  const sendPasswordReset = async (email) => {
    try {
      const result = await sendPasswordResetEmailToUser(email);
      
      if (result && result.ok) {
        showSuccessAlert(
          'Email enviado',
          `Se ha enviado un enlace de restablecimiento a ${email}`
        );
        return { ok: true };
      } else {
        showErrorAlert(
          'Error al enviar email',
          result?.errorMessage || 'No se pudo enviar el email de restablecimiento'
        );
        return { ok: false, errorMessage: result?.errorMessage };
      }
    } catch (error) {
      console.error('Error al enviar email de restablecimiento:', error);
      showErrorAlert(
        'Error inesperado',
        'Ocurrió un error al intentar enviar el email'
      );
      return { ok: false, errorMessage: error.message };
    }
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    sendPasswordReset,
  };
};
