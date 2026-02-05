import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import HomePage from '../modules/home/pages/HomePage';
import { FamilyRoutes } from '../modules/family/routes/FamilyRoutes';
import { UsersRoutes } from '../modules/user/routes/UsersRoutes';
import { MemberRoutes } from '../modules/members/routes/MemberRoutes';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleProtectedRoute } from './RoleProtectedRoute';

export const BaseRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Ruta de Familia (protegida) */}
        <Route 
          path="/familia/*" 
          element={
            <ProtectedRoute>
              <FamilyRoutes />
            </ProtectedRoute>
          } 
        />

        {/* Ruta de Miembros (protegida) */}
        <Route 
          path="/miembros/*" 
          element={
            <ProtectedRoute>
              <MemberRoutes />
            </ProtectedRoute>
          } 
        />

        {/* Ruta de Usuarios (solo admin) */}
        <Route 
          path="/usuarios/*" 
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={['admin']}>
                <UsersRoutes />
              </RoleProtectedRoute>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AppLayout>
  );
};
