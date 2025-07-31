import { Navigate, Route, Routes } from 'react-router-dom'
import AttendeesListPage from '../pages/AttendeesListPage'

export const AttendeesRoutes = () => {
  return (
    <Routes>
        <Route path="listado" element={<AttendeesListPage />} />

        <Route path="/*" element={<Navigate to="/asistentes/listado"/>} />
    </Routes>
  )
}