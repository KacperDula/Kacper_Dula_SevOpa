import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ roles }) => {
  // Wrapper for <Route> blocks that enforces login and optional role checks
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) { // kick anonymous visitors to the login screen
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) { // logged in but missing the required role -> send home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
