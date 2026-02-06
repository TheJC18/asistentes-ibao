import { useDispatch, useSelector } from 'react-redux';
import { 
  startLoadingUsers, 
  startLoadingUserById,
  startCreatingUser,
  startUpdatingUser,
  startDeletingUser,
  setFilters,
  clearFilters,
  setCurrentPage,
  clearCurrentUser,
  clearUserState
} from '@/modules/user/store';
import { RootState, AppDispatch } from '@/core/store';
import { User, UserFilters, Pagination } from '@/types';

export const useUserStore = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    users,
    isLoading,
    error,
    currentUser,
    isUserLoading,
    userError,
    isCreating,
    isUpdating,
    isDeleting,
    filters,
    pagination
  } = useSelector((state: RootState) => state.user);

  // === MÉTODOS PARA LISTA DE USUARIOS ===
  const loadUsers = (customFilters: Partial<UserFilters> = {}, customPagination: Partial<Pagination> = {}) => {
    const finalFilters = { ...filters, ...customFilters };
    const finalPagination = { ...pagination, ...customPagination };
    dispatch(startLoadingUsers(finalFilters, finalPagination));
  };

  const refreshUsers = () => {
    dispatch(startLoadingUsers(filters, pagination));
  };

  // === MÉTODOS PARA USUARIO INDIVIDUAL ===
  const loadUserById = (userId: string) => {
    dispatch(startLoadingUserById(userId));
  };

  const clearUser = () => {
    dispatch(clearCurrentUser());
  };

  // === MÉTODOS CRUD ===
  const createUser = async (userData: any) => {
    return await dispatch(startCreatingUser(userData));
  };

  const updateUser = async (userId: string, userData: any) => {
    return await dispatch(startUpdatingUser(userId, userData));
  };

  const deleteUser = async (userId: string) => {
    return await dispatch(startDeletingUser(userId));
  };

  // === MÉTODOS DE BÚSQUEDA Y FILTROS ===
  const updateFilters = (newFilters: Partial<UserFilters>) => {
    dispatch(setFilters(newFilters));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
    loadUsers({}, pagination);
  };

  // === MÉTODOS DE PAGINACIÓN ===
  const goToPage = (page: number) => {
    dispatch(setCurrentPage(page));
    loadUsers(filters, { ...pagination, currentPage: page });
  };

  const nextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      goToPage(pagination.currentPage + 1);
    }
  };

  const prevPage = () => {
    if (pagination.currentPage > 1) {
      goToPage(pagination.currentPage - 1);
    }
  };

  // === MÉTODO PARA LIMPIAR TODO ===
  const clearAllUserData = () => {
    dispatch(clearUserState());
  };

  // === MÉTODOS DE UTILIDAD ===
  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };

  const isUserInList = (userId: string): boolean => {
    return users.some(user => user.id === userId);
  };

  return {
    // Estado
    users,
    currentUser,
    isLoading,
    isUserLoading,
    error,
    userError,
    isCreating,
    isUpdating,
    isDeleting,
    filters,
    pagination,
    
    // Métodos de lista
    loadUsers,
    refreshUsers,
    
    // Métodos de usuario individual
    loadUserById,
    clearUser,
    
    // Métodos CRUD
    createUser,
    updateUser,
    deleteUser,
    
    // Métodos de filtros
    updateFilters,
    resetFilters,
    
    // Métodos de paginación
    goToPage,
    nextPage,
    prevPage,
    
    // Utilidades
    clearAllUserData,
    getUserById,
    isUserInList,
    
    // Estados computados
    hasUsers: users.length > 0,
    hasNextPage: pagination.currentPage < pagination.totalPages,
    hasPrevPage: pagination.currentPage > 1,
    totalUsers: pagination.totalUsers,
    isFirstPage: pagination.currentPage === 1,
    isLastPage: pagination.currentPage === pagination.totalPages
  };
};
