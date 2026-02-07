import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const ServicesPage = () => {
  // Public landing page that advertises available services and nudges guests to log in
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { // fetch once on mount
    const load = async () => { // basic error/loader handling is enough here
      try {
        const { data } = await serviceApi.list();
        setServices(data);
      } catch (err) {
        setError('Unable to load services');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p>Loading services...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div>
      <h2>Available services</h2>
      <p className="muted">Choose a service and submit a booking request.</p>
      <div className="grid">
        {services.map((service) => (
          <div key={service.id} className="card">
            <h3>{service.name}</h3>
            <p>{service.description || 'No description provided'}</p>
            <p className="muted">Duration: {service.duration} minutes</p>
          </div>
        ))}
      </div>
      {!isAuthenticated && (
        <div className="card mt">
          <p>Ready to book? <Link to="/login">Login</Link> or <Link to="/register">create an account</Link>.</p>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
