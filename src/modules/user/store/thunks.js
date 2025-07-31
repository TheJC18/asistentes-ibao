import { 
    setLoadingUsers, 
    setUsers, 
    setUsersError,
    setLoadingUser,
    setCurrentUser,
    setUserError,
    setCreating,
    setUpdating,
    setDeleting,
    addUser,
    updateUser,
    removeUser,
    setFilters
} from './userSlice';

// Importar funciones reales de Firebase
import { 
    getUsersFromFirebase, 
    getUserByIdFromFirebase, 
    createUserInFirebase, 
    updateUserInFirebase, 
    deleteUserFromFirebase 
} from '../firebase/userQueries';

// === OBTENER LISTA DE USUARIOS ===
export const startLoadingUsers = (filters = {}, pagination = {}) => {
    return async (dispatch) => {
        try {
            dispatch(setLoadingUsers());
            
            // Llamada a Firebase
            const result = await getUsersFromFirebase({
                ...filters,
                page: pagination.currentPage || 1,
                limit: pagination.limit || 10
            });
            
            if (result.ok) {
                dispatch(setUsers({
                    users: result.users,
                    pagination: {
                        currentPage: result.currentPage,
                        totalPages: result.totalPages,
                        totalUsers: result.totalUsers,
                        limit: result.limit
                    }
                }));
            } else {
                dispatch(setUsersError(result.errorMessage));
            }
        } catch (error) {
            dispatch(setUsersError('Error al cargar usuarios: ' + error.message));
        }
    };
};

// === OBTENER USUARIO POR ID ===
export const startLoadingUserById = (userId) => {
    return async (dispatch) => {
        try {
            dispatch(setLoadingUser());
            
            const result = await getUserByIdFromFirebase(userId);
            
            if (result.ok) {
                dispatch(setCurrentUser(result.user));
            } else {
                dispatch(setUserError(result.errorMessage));
            }
        } catch (error) {
            dispatch(setUserError('Error al cargar usuario: ' + error.message));
        }
    };
};

// === CREAR USUARIO ===
export const startCreatingUser = (userData) => {
    return async (dispatch) => {
        try {
            dispatch(setCreating(true));
            
            const result = await createUserInFirebase(userData);
            
            if (result.ok) {
                dispatch(addUser(result.user));
                dispatch(setCreating(false));
                return { ok: true, user: result.user };
            } else {
                dispatch(setCreating(false));
                return { ok: false, errorMessage: result.errorMessage };
            }
        } catch (error) {
            dispatch(setCreating(false));
            return { ok: false, errorMessage: 'Error al crear usuario: ' + error.message };
        }
    };
};

// === ACTUALIZAR USUARIO ===
export const startUpdatingUser = (userId, userData) => {
    return async (dispatch) => {
        try {
            dispatch(setUpdating(true));
            
            const result = await updateUserInFirebase(userId, userData);
            
            if (result.ok) {
                dispatch(updateUser(result.user));
                dispatch(setUpdating(false));
                return { ok: true, user: result.user };
            } else {
                dispatch(setUpdating(false));
                return { ok: false, errorMessage: result.errorMessage };
            }
        } catch (error) {
            dispatch(setUpdating(false));
            return { ok: false, errorMessage: 'Error al actualizar usuario: ' + error.message };
        }
    };
};

// === ELIMINAR USUARIO ===
export const startDeletingUser = (userId) => {
    return async (dispatch) => {
        try {
            dispatch(setDeleting(true));
            
            const result = await deleteUserFromFirebase(userId);
            
            if (result.ok) {
                dispatch(removeUser(userId));
                dispatch(setDeleting(false));
                return { ok: true };
            } else {
                dispatch(setDeleting(false));
                return { ok: false, errorMessage: result.errorMessage };
            }
        } catch (error) {
            dispatch(setDeleting(false));
            return { ok: false, errorMessage: 'Error al eliminar usuario: ' + error.message };
        }
    };
};

// === BÚSQUEDA DE USUARIOS ===
export const startSearchUsers = (searchTerm) => {
    return async (dispatch, getState) => {
        const { user } = getState();
        
        const filters = {
            ...user.filters,
            searchTerm
        };
        
        // Actualizar filtros y recargar
        dispatch(setFilters(filters));
        dispatch(startLoadingUsers(filters, user.pagination));
    };
};

// === FILTRAR POR ROL ===
export const startFilterByRole = (role) => {
    return async (dispatch, getState) => {
        const { user } = getState();
        
        const filters = {
            ...user.filters,
            role
        };
        
        dispatch(setFilters(filters));
        dispatch(startLoadingUsers(filters, user.pagination));
    };
};