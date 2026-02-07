import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Layout = () => {
  // Shared chrome with nav links + auth actions that wraps every route
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { // clear auth state and kick folks back to the landing page
    logout();
    navigate('/');
  };

  const navClass = ({ isActive }) => (isActive ? 'active' : undefined); // lets us highlight whichever nav item is selected

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">Booking Manager</Link>
        <nav>
          <NavLink to="/" end className={navClass}>Services</NavLink>
          {isAuthenticated && <NavLink to="/bookings" className={navClass}>My Bookings</NavLink>}
          {user?.role === 'ROLE_ADMIN' && <NavLink to="/admin/services" className={navClass}>Manage Services</NavLink>}
        </nav>
        <div className="auth-actions">
          {isAuthenticated ? (
            <>
              <span className="welcome">Hi, {user?.username}</span>
              <button type="button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="secondary">Register</Link>
            </>
          )}
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
