import { AppDispatch } from '@/core/store';
import { getAllMembers } from '../firebase/memberQueries';
import { convertDateFieldsToISO } from '@/core/helpers/dateUtils';
import { GetAllMembersParams } from '../types';
import { loadMembers, setLoading, setError } from './memberSlice';

export const fetchAllMembers = (params: GetAllMembersParams = {}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    
    try {
      const result = await getAllMembers(params);
      
      if (result.ok && result.users) {
        // Usar helper para convertir fechas
        const serializableUsers = result.users.map(user => {
          const userWithDates = convertDateFieldsToISO(user);
          if (Array.isArray(userWithDates.family)) {
            userWithDates.family = userWithDates.family.map(fam => convertDateFieldsToISO(fam));
          }
          return userWithDates;
        });
        dispatch(loadMembers(serializableUsers));
      } else {
        dispatch(setError(result.errorMessage || 'Error al cargar los miembros'));
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Error inesperado'));
    }
  };
};