import { useSelector } from 'react-redux';
import { RootState } from '@/core/store/store';

export function useAuthUser() {
  const auth = useSelector((state: RootState) => state.auth);
  return auth;
}
