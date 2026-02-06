import { Routes, Route } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/modules/auth/pages';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="iniciar-sesion" element={<LoginPage />} />
      <Route path="registro" element={<RegisterPage />} />
    </Routes>
  );
};
