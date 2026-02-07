import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import AdminServicesPage from './pages/AdminServicesPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const App = () => (
  // Route definitions with two levels of protection (auth only, admin only)
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<ServicesPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="bookings" element={<BookingsPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={['ROLE_ADMIN']} />}>
        <Route path="admin/services" element={<AdminServicesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default App;
