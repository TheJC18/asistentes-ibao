import { Navigate, Route, Routes } from 'react-router-dom';
import FamilyListPage from '@/modules/family/pages/FamilyListPage';

export const FamilyRoutes = () => {
  return (
    <Routes>
      <Route path="listado" element={<FamilyListPage />} />
      <Route path="/*" element={<Navigate to="/familia/listado"/>} />
    </Routes>
  );
};
