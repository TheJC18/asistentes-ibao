import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store/store';

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const RoleProtectedRoute = ({ children, allowedRoles = [] }: RoleProtectedRouteProps) => {
  const { status, role, profileCompleted } = useSelector((state: RootState) => state.auth);

  if (status === 'not-authenticated') {
    return <Navigate to="/auth/iniciar-sesion" />;
  }

  if (status === 'authenticated' && !profileCompleted) {
    return <Navigate to="/" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role || '')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
        <div className="text-center p-8 bg-card rounded-lg shadow-lg">
          <h1 className="text-6xl font-bold text-error mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Acceso Denegado
          </h2>
          <p className="text-text-secondary mb-6">
            No tienes permisos para acceder a esta sección.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-secondary text-text-on-primary rounded-lg hover:bg-secondary-hover transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
