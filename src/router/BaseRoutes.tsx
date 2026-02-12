import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from '@/layout/AppLayout';
const HomePage = lazy(() => import('@/modules/home/pages/HomePage'));
const FamilyRoutes = lazy(() => import('@/modules/family/routes/FamilyRoutes').then(m => ({ default: m.FamilyRoutes })));
const UsersRoutes = lazy(() => import('@/modules/user/routes/UsersRoutes').then(m => ({ default: m.UsersRoutes })));
const MemberRoutes = lazy(() => import('@/modules/members/routes/MemberRoutes').then(m => ({ default: m.MemberRoutes })));
const CalendarRoutes = lazy(() => import('@/modules/calendar/routes/CalendarRoutes').then(m => ({ default: m.CalendarRoutes })));
const EventRoutes = lazy(() => import('@/modules/events/routes/EventRoutes').then(m => ({ default: m.EventRoutes })));
import { ROLES } from '@/core/helpers/roles';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleProtectedRoute } from './RoleProtectedRoute';

export const BaseRoutes = () => {
  return (
    <AppLayout>
      <Suspense fallback={<div className="flex justify-center items-center min-h-[40vh]"><span className="text-lg">Cargando...</span></div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Ruta de Calendario (protegida) */}
          <Route 
            path="/calendario/*" 
            element={
              <ProtectedRoute>
                <CalendarRoutes />
              </ProtectedRoute>
            } 
          />

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
                <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <UsersRoutes />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } 
          />
          {/* Ruta de Eventos (solo admin) */}
          <Route 
            path="/eventos/*" 
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <EventRoutes />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Suspense>
    </AppLayout>
  );
};
