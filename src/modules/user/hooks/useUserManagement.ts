import { useState, useEffect } from 'react';
import { useUserStore } from './useUserStore';
import { useUserModal } from './useUserModal';
import { useUserActions } from './useUserActions';
import { User } from '@/types';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Manejar guardado de usuario (crear o editar)
   */
  const handleSave = async (data: any) => {
    let result;
    
    if (mode === 'create') {
      result = await createUser(data);
    } else if (mode === 'edit') {
      result = await updateUser(user.id || '', data);
    }
    
    // Si fue exitoso, refrescar la lista y cerrar el modal
    if (result && result.ok) {
      await refreshUsers();
      handleClose();
    }
  };

  /**
   * Manejar eliminación de usuario
   */
  const handleDelete = async (userToDelete: User) => {
    const result = await deleteUser(
      userToDelete.id, 
      userToDelete.displayName || userToDelete.name || ''
    );
    
    // Si fue exitoso, refrescar la lista
    if (result && result.ok) {
      await refreshUsers();
    }
  };

  /**
   * Manejar apertura del modal para ver usuario
   */
  const handleView = (userToView: User) => {
    handleOpen('view', userToView);
  };

  /**
   * Manejar apertura del modal para editar usuario
   */
  const handleEdit = (userToEdit: User) => {
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
  const handlePasswordReset = async (email: string) => {
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
