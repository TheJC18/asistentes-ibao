import { AppDispatch } from '@/core/store';
import { getAllMembers } from '../firebase/memberQueries';
import { GetAllMembersParams } from '../types';
import { loadMembers, setLoading, setError } from './memberSlice';

export const fetchAllMembers = (params: GetAllMembersParams = {}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    
    try {
      const result = await getAllMembers(params);
      
      if (result.ok && result.users) {
        dispatch(loadMembers(result.users));
      } else {
        dispatch(setError(result.errorMessage || 'Error al cargar los miembros'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Error inesperado'));
    }
  };
};