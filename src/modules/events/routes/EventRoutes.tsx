import { Navigate, Route, Routes } from 'react-router-dom';
import { EventListPage } from '../pages';

export const EventRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EventListPage />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};
