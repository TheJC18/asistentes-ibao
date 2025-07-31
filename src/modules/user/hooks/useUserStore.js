import { useDispatch, useSelector } from 'react-redux';
import { 
    startLoadingUsers, 
    startLoadingUserById,
    startCreatingUser,
    startUpdatingUser,
    startDeletingUser,
    startSearchUsers,
    startFilterByRole,
    setFilters,
    clearFilters,
    setCurrentPage,
    clearCurrentUser,
    clearUserState
} from '../store';

export const useUserStore = () => {
    const dispatch = useDispatch();
    
    const {
        // Lista de usuarios
        users,
        isLoading,
        error,
        
        // Usuario individual
        currentUser,
        isUserLoading,
        userError,
        
        // Estados CRUD
        isCreating,
        isUpdating,
        isDeleting,
        
        // Filtros y paginación
        filters,
        pagination
    } = useSelector(state => state.user);

    // === MÉTODOS PARA LISTA DE USUARIOS ===
    const loadUsers = (customFilters = {}, customPagination = {}) => {
        const finalFilters = { ...filters, ...customFilters };
        const finalPagination = { ...pagination, ...customPagination };
        dispatch(startLoadingUsers(finalFilters, finalPagination));
    };

    const refreshUsers = () => {
        dispatch(startLoadingUsers(filters, pagination));
    };

    // === MÉTODOS PARA USUARIO INDIVIDUAL ===
    const loadUserById = (userId) => {
        dispatch(startLoadingUserById(userId));
    };

    const clearUser = () => {
        dispatch(clearCurrentUser());
    };

    // === MÉTODOS CRUD ===
    const createUser = async (userData) => {
        return await dispatch(startCreatingUser(userData));
    };

    const updateUser = async (userId, userData) => {
        return await dispatch(startUpdatingUser(userId, userData));
    };

    const deleteUser = async (userId) => {
        return await dispatch(startDeletingUser(userId));
    };

    // === MÉTODOS DE BÚSQUEDA Y FILTROS ===
    const searchUsers = (searchTerm) => {
        dispatch(startSearchUsers(searchTerm));
    };

    const filterByRole = (role) => {
        dispatch(startFilterByRole(role));
    };

    const updateFilters = (newFilters) => {
        dispatch(setFilters(newFilters));
    };

    const resetFilters = () => {
        dispatch(clearFilters());
        loadUsers({}, pagination);
    };

    // === MÉTODOS DE PAGINACIÓN ===
    const goToPage = (page) => {
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
    const getUserById = (userId) => {
        return users.find(user => user.id === userId);
    };

    const isUserInList = (userId) => {
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
        
        // Métodos de búsqueda y filtros
        searchUsers,
        filterByRole,
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
