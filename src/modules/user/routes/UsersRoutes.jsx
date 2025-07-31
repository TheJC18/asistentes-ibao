import { Navigate, Route, Routes } from 'react-router-dom'
import UserListPage from '../pages/UserListPage'

export const UsersRoutes = () => {
  return (
    <Routes>
        <Route path="listado" element={<UserListPage />} />

        <Route path="/*" element={<Navigate to="/usuarios/listado"/>} />
    </Routes>
  )
}