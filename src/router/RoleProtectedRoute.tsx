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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No tienes permisos para acceder a esta sección.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
