import { Navigate, Route, Routes } from 'react-router-dom';
import MemberListPage from '@/modules/members/pages/MemberListPage';

export const MemberRoutes = () => {
  return (
    <Routes>
      <Route path="listado" element={<MemberListPage />} />
      <Route path="/*" element={<Navigate to="/miembros/listado"/>} />
    </Routes>
  );
};