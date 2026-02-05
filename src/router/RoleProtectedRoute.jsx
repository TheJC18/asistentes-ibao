import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { status, role, profileCompleted } = useSelector((state) => state.auth);

  // Mientras se verifica la autenticación o profileCompleted no se ha cargado, mostrar loader
  if (status === 'checking' || profileCompleted === null || role === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si el perfil no está completado (explícitamente false), redirigir al home
  if (profileCompleted === false) {
    return <Navigate to="/" replace />;
  }

  // Verificar si el rol del usuario está en los roles permitidos
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center px-4">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Acceso Denegado
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No tienes permisos para acceder a esta sección
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Volver
        </button>
      </div>
    );
  }

  return children;
};
