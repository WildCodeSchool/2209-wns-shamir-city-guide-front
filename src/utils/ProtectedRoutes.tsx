import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../features/store';
import NotAllowed from '../pages/errors/notAllowed/NotAllowed';

interface IProps {
  requiredRoles: string[]
}

export const ProtectedRoutes = ({ requiredRoles }: IProps) => {
  const location = useLocation();
  const nextRoute = location.pathname;
  const userData = useAppSelector((state) => state.userReducer.user);
  
  const userHasRequiredRole = userData.infos.roles.some((role) => requiredRoles.includes(role.name));

  if (!userData.isLogged && requiredRoles.length === 0) {
    return <Outlet />
  } 

  if (userData.isLogged && requiredRoles.length === 0) {
    return <Navigate to='/private/dashboard' />
  } 
  
  if (!userData.isLogged) return <Navigate to="/login" state={nextRoute} />

  if (userData.isLogged && userHasRequiredRole) {
   return <Outlet />
  }

  if (userData.isLogged && !userHasRequiredRole) {
    return <NotAllowed />
   }
  return (<></>)
}

export default ProtectedRoutes;