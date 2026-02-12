import { Navigate, Route, Routes } from 'react-router-dom';
import { useCheckAuth } from '@/core/hooks';
import { AuthRoutes } from '@/modules/auth/routes/AuthRoutes';
import { BaseRoutes } from '@/router/BaseRoutes';
import ChekingAuth from '@/core/components/ui/ChekingAuth';

export const AppRouter = () => {
  const { status } = useCheckAuth();

  if (status === 'checking') {
    return <ChekingAuth />;
  }

  return (
    <Routes>
      {status === 'authenticated' ? (
        <>
          <Route path="/*" element={<BaseRoutes />} />
          {/* Redirige a home si está autenticado e intenta acceder a rutas de auth */}
          <Route path="/auth/*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/auth/*" element={<AuthRoutes />} />
          {/* Redirige a login si no está autenticado */}
          <Route path="/*" element={<Navigate to="/auth/iniciar-sesion" replace />} />
        </>
      )}
    </Routes>
  );
};
