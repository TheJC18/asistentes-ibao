import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import HomePage from '../modules/home/pages/HomePage';
import { FamilyRoutes } from '../modules/family/routes/FamilyRoutes';
import { UsersRoutes } from '../modules/user/routes/UsersRoutes';
import { AttendeesRoutes } from '../modules/attendees/routes/AttendeesRoutes';
import { MemberRoutes } from '../modules/members/routes/MemberRoutes';

export const BaseRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/familia/*" element={<FamilyRoutes />} />
        <Route path="/asistentes/*" element={<AttendeesRoutes />} />
        <Route path="/miembros/*" element={<MemberRoutes />} />
        <Route path="/usuarios/*" element={<UsersRoutes />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </AppLayout>
  );
};
