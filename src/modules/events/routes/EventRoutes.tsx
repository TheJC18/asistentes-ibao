import { Navigate, Route, Routes } from 'react-router-dom';
import EventListPage from '../pages/EventListPage';

export const EventRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EventListPage />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};