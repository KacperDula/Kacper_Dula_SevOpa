import axios from 'axios';

const api = axios.create({ // central axios instance so we only define base URL + interceptors once
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
});

api.interceptors.request.use((config) => { // attach JWT if we have one stored
  const stored = localStorage.getItem('booking_app_auth');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authApi = { // grouped helpers keep components nice and tidy
  login: (payload) => api.post('/api/auth/login', payload),
  register: (payload) => api.post('/api/auth/register', payload)
};

export const serviceApi = {
  list: () => api.get('/api/services'),
  find: (id) => api.get(`/api/services/${id}`),
  create: (payload) => api.post('/api/services', payload),
  update: (id, payload) => api.put(`/api/services/${id}`, payload),
  remove: (id) => api.delete(`/api/services/${id}`)
};

export const bookingApi = {
  list: () => api.get('/api/bookings'),
  create: (payload) => api.post('/api/bookings', payload),
  update: (id, payload) => api.put(`/api/bookings/${id}`, payload),
  cancel: (id) => api.post(`/api/bookings/${id}/cancel`),
  remove: (id) => api.delete(`/api/bookings/${id}`)
};

export default api;
