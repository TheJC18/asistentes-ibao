import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children }) => {
  const { status, profileCompleted } = useSelector((state) => state.auth);

  // Mientras se verifica la autenticación o profileCompleted no se ha cargado, mostrar loader
  if (status === 'checking' || profileCompleted === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Verificando...</span>
      </div>
    );
  }

  // Si el perfil no está completado (explícitamente false), redirigir al home
  if (profileCompleted === false) {
    return <Navigate to="/" replace />;
  }

  return children;
};
