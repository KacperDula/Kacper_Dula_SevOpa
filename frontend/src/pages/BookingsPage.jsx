import { useEffect, useState } from 'react';
import { bookingApi, serviceApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptyForm = { date: '', time: '', serviceId: '' };

const BookingsPage = () => {
  // Authenticated workspace where people create, adjust, and cancel their own bookings
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const loadData = async () => { // hit bookings + services in parallel so the form has options ready
    setLoading(true);
    try {
      const [{ data: bookingData }, { data: serviceData }] = await Promise.all([
        bookingApi.list(),
        serviceApi.list()
      ]);
      setBookings(bookingData);
      setServices(serviceData);
    } catch (err) {
      setMessage('Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => { // sync inputs to state
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => { // create vs update share the same payload builder
    event.preventDefault();
    setMessage(null);
    try {
      const payload = {
        date: form.date,
        time: form.time,
        serviceId: Number(form.serviceId)
      };
      if (editingId) {
        await bookingApi.update(editingId, payload);
        setMessage('Booking updated');
      } else {
        await bookingApi.create(payload);
        setMessage('Booking created');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to save booking');
    }
  };

  const handleEdit = (booking) => { // load the existing booking into the form for tweaking
    setEditingId(booking.id);
    setForm({
      date: booking.date,
      time: booking.time,
      serviceId: booking.service.id.toString()
    });
  };

  const handleCancel = async (id) => { // regular users can always cancel their reservations
    try {
      await bookingApi.cancel(id);
      setMessage('Booking cancelled');
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to cancel booking');
    }
  };

  const handleDelete = async (id) => { // admin-only action exposed in UI when role matches
    try {
      await bookingApi.remove(id);
      setMessage('Booking deleted');
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to delete booking');
    }
  };

  return (
    <div>
      <h2>My bookings</h2>
      <div className="card">
        <h3>{editingId ? 'Update booking' : 'Create a booking'}</h3>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Date
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
          </label>
          <label>
            Time
            <input type="time" name="time" value={form.time} onChange={handleChange} required />
          </label>
          <label>
            Service
            <select name="serviceId" value={form.serviceId} onChange={handleChange} required>
              <option value="" disabled>Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </label>
          <div className="form-actions">
            <button type="submit">{editingId ? 'Update' : 'Book'}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
        {message && <p className="muted">{message}</p>}
      </div>

      {loading ? (
        <p>Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="card">
          <p className="muted">No bookings yet. Use the form above to make one.</p>
        </div>
      ) : (
        <div className="grid">
          {bookings.map((booking) => (
            <div key={booking.id} className="card">
              <div className="card-header">
                <h3>{booking.service.name}</h3>
                <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span>
              </div>
              <p>{booking.date} at {booking.time}</p>
              <p className="muted">Duration: {booking.service.duration} minutes</p>
              <div className="card-actions">
                <button type="button" onClick={() => handleEdit(booking)}>Edit</button>
                {booking.status !== 'CANCELLED' && (
                  <button type="button" className="secondary" onClick={() => handleCancel(booking.id)}>
                    Cancel
                  </button>
                )}
                {user?.role === 'ROLE_ADMIN' && (
                  <button type="button" className="danger" onClick={() => handleDelete(booking.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
