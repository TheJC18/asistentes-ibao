import { AppDispatch } from '@/core/store';
import { User, UserFilters, Pagination } from '@/types';
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
} from './userSlice';

// Importar funciones reales de Firebase
import { 
  getUsersFromFirebase, 
  getUserByIdFromFirebase, 
  createUserInFirebase, 
  updateUserInFirebase, 
  deleteUserFromFirebase 
} from '@/modules/user/firebase/userQueries';

interface LoadUsersParams extends Partial<UserFilters> {
  page?: number;
  limit?: number;
}

// === OBTENER LISTA DE USUARIOS ===
export const startLoadingUsers = (filters: LoadUsersParams = {}, pagination: Partial<Pagination> = {}) => {
  return async (dispatch: AppDispatch) => {
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
          users: result.users || [],
          pagination: {
            currentPage: result.currentPage || 1,
            totalPages: result.totalPages || 1,
            totalUsers: result.totalUsers || 0,
            limit: result.limit || 10
          }
        }));
      } else {
        dispatch(setUsersError(result.errorMessage || 'Error al cargar usuarios'));
      }
    } catch (error: any) {
      dispatch(setUsersError('Error al cargar usuarios: ' + error.message));
    }
  };
};

// === OBTENER USUARIO POR ID ===
export const startLoadingUserById = (userId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoadingUser());
      
      const result = await getUserByIdFromFirebase(userId);
      
      if (result.ok && result.user) {
        dispatch(setCurrentUser(result.user));
      } else {
        dispatch(setUserError(result.errorMessage || 'Error al cargar usuario'));
      }
    } catch (error: any) {
      dispatch(setUserError('Error al cargar usuario: ' + error.message));
    }
  };
};

interface CreateUserResult {
  ok: boolean;
  user?: User;
  errorMessage?: string;
}

// === CREAR USUARIO ===
export const startCreatingUser = (userData: any) => {
  return async (dispatch: AppDispatch): Promise<CreateUserResult> => {
    try {
      dispatch(setCreating(true));
      
      const result = await createUserInFirebase(userData);
      
      if (result.ok && result.user) {
        dispatch(addUser(result.user));
        dispatch(setCreating(false));
        return { ok: true, user: result.user };
      } else {
        dispatch(setCreating(false));
        return { ok: false, errorMessage: result.errorMessage };
      }
    } catch (error: any) {
      dispatch(setCreating(false));
      return { ok: false, errorMessage: 'Error al crear usuario: ' + error.message };
    }
  };
};

interface UpdateUserResult {
  ok: boolean;
  user?: User;
  errorMessage?: string;
  migrated?: boolean;
  oldId?: string;
  newId?: string;
}

// === ACTUALIZAR USUARIO ===
export const startUpdatingUser = (userId: string, userData: any) => {
  return async (dispatch: AppDispatch): Promise<UpdateUserResult> => {
    try {
      dispatch(setUpdating(true));
      
      const result = await updateUserInFirebase(userId, userData);
      
      if (result.ok && result.user) {
        dispatch(updateUser(result.user));
        dispatch(setUpdating(false));
        
        if (result.migrated) {
          return { 
            ok: true, 
            user: result.user,
            migrated: true,
            oldId: result.oldId,
            newId: result.newId
          };
        }
        
        return { ok: true, user: result.user };
      } else {
        dispatch(setUpdating(false));
        return { ok: false, errorMessage: result.errorMessage };
      }
    } catch (error: any) {
      dispatch(setUpdating(false));
      return { ok: false, errorMessage: 'Error al actualizar usuario: ' + error.message };
    }
  };
};

interface DeleteUserResult {
  ok: boolean;
  errorMessage?: string;
}

// === ELIMINAR USUARIO ===
export const startDeletingUser = (userId: string) => {
  return async (dispatch: AppDispatch): Promise<DeleteUserResult> => {
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
    } catch (error: any) {
      dispatch(setDeleting(false));
      return { ok: false, errorMessage: 'Error al eliminar usuario: ' + error.message };
    }
  };
};
