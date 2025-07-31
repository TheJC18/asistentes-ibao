import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthRoutes } from '../modules/auth/routes/AuthRoutes'
import { useCheckAuth } from '../hooks'
import { ChekingAuth } from '../ui/'
import { BaseRoutes } from './BaseRoutes'

export const AppRouter = () => {

  const {status} = useCheckAuth();

  if( status === 'checking'){
    return <ChekingAuth/>
  } 

  return (
    <Routes>
      {
        (status === 'authenticated')
        ? <Route path="/*" element={ <BaseRoutes /> } />
        : <Route path="/auth/*" element={ <AuthRoutes /> } />
      }
      <Route path="/*" element={ <Navigate to='/auth/iniciar-sesion'/> } />
    </Routes>
  )
}
