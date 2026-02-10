import { Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';

const LoginPage = React.lazy(() => import('@/modules/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = React.lazy(() => import('@/modules/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));

export const AuthRoutes = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[40vh]"><span className="text-lg">Cargando...</span></div>}>
      <Routes>
        <Route path="iniciar-sesion" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />
      </Routes>
    </Suspense>
  );
};
