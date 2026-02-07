import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const RegisterPage = () => {
  // Mirrors the login form but hits the register endpoint and auto-signs the user in afterwards
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => { // reuse the AuthContext setter once the API returns a token
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.register(form);
      setSession({ token: data.token, username: form.username, role: data.role });
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create an account</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Username
          <input name="username" value={form.username} onChange={handleChange} required minLength={3} />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
