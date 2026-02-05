import { useState, useEffect } from 'react';
import { useUserStore } from './useUserStore';
import { useUserModal } from './useUserModal';
import { useUserActions } from './useUserActions';

/**
 * Hook orquestador para la gestión completa de usuarios
 * Combina el store, modal y acciones CRUD
 */
export const useUserManagement = () => {
  // Store de usuarios (lista, loading, error)
  const {
    users,
    isLoading,
    error,
    isDeleting,
    loadUsers,
    refreshUsers
  } = useUserStore();

  // Modal (estado de apertura/cierre, modo, usuario seleccionado)
  const {
    open,
    mode,
    user,
    handleOpen,
    handleClose,
  } = useUserModal();

  // Acciones CRUD (create, update, delete, sendPasswordReset)
  const {
    createUser,
    updateUser,
    deleteUser,
    sendPasswordReset,
  } = useUserActions();

  // Cargar usuarios al montar
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Manejar guardado de usuario (crear o editar)
   * Esta función orquesta el flujo completo
   */
  const handleSave = async (data) => {
    let result;
    
    if (mode === 'create') {
      result = await createUser(data);
    } else if (mode === 'edit') {
      result = await updateUser(user.id, data);
    }
    
    // Si fue exitoso, refrescar la lista y cerrar el modal
    if (result && result.ok) {
      await refreshUsers();
      handleClose();
      
      // Si hubo migración de ID (usuario sin acceso → con acceso)
      // Informar al usuario para que sepa que el ID cambió
      if (result.migrated && result.oldId && result.newId) {
        console.log(`Usuario migrado: ${result.oldId} → ${result.newId}`);
        // La lista ya se refrescó, por lo que el nuevo ID aparecerá automáticamente
      }
    }
  };

  /**
   * Manejar eliminación de usuario
   */
  const handleDelete = async (userToDelete) => {
    const result = await deleteUser(
      userToDelete.id, 
      userToDelete.displayName || userToDelete.name
    );
    
    // Si fue exitoso, refrescar la lista
    if (result && result.ok) {
      await refreshUsers();
    }
  };

  /**
   * Manejar apertura del modal para ver usuario
   */
  const handleView = (userToView) => {
    handleOpen('view', userToView);
  };

  /**
   * Manejar apertura del modal para editar usuario
   */
  const handleEdit = (userToEdit) => {
    handleOpen('edit', userToEdit);
  };

  /**
   * Manejar apertura del modal para crear usuario
   */
  const handleCreate = () => {
    handleOpen('create');
  };

  /**
   * Reintentar carga de usuarios en caso de error
   */
  const handleRetry = () => {
    loadUsers();
  };

  /**
   * Manejar envío de email de restablecimiento de contraseña
   */
  const handlePasswordReset = async (email) => {
    await sendPasswordReset(email);
  };

  return {
    // Estado del store
    users,
    isLoading,
    error,
    isDeleting,
    
    // Estado del modal
    modalOpen: open,
    modalMode: mode,
    selectedUser: user,
    
    // Acciones
    handleSave,
    handleDelete,
    handleView,
    handleEdit,
    handleCreate,
    handleClose,
    handleRetry,
    handlePasswordReset,
  };
};
