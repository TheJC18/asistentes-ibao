import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store/store';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { status, profileCompleted } = useSelector((state: RootState) => state.auth);

  if (status === 'not-authenticated') {
    return <Navigate to="/auth/iniciar-sesion" />;
  }

  if (status === 'authenticated' && !profileCompleted) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
