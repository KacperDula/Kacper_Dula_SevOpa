import { useEffect, useState } from 'react';
import { serviceApi } from '../services/api.js';

const blank = { name: '', description: '', duration: 60 };

const AdminServicesPage = () => {
  // Admin-only CRUD view for keeping the services catalog tidy
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  const load = async () => { // refresh the list after every mutation so UI stays in sync
    try {
      const { data } = await serviceApi.list();
      setServices(data);
    } catch {
      setMessage('Unable to load services');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => { // one handler supports both create + update flows
    event.preventDefault();
    setMessage(null);
    try {
      const payload = { ...form, duration: Number(form.duration) };
      if (editingId) {
        await serviceApi.update(editingId, payload);
        setMessage('Service updated');
      } else {
        await serviceApi.create(payload);
        setMessage('Service created');
      }
      setForm(blank);
      setEditingId(null);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to save service');
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description ?? '',
      duration: service.duration
    });
  };

  const handleDelete = async (id) => { // remove a service and reload the table on success
    try {
      await serviceApi.remove(id);
      setMessage('Service deleted');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to delete');
    }
  };

  return (
    <div>
      <h2>Manage services</h2>
      <div className="card">
        <h3>{editingId ? 'Update service' : 'Create service'}</h3>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </label>
          <label>
            Duration (minutes)
            <input type="number" min="15" step="5" name="duration" value={form.duration} onChange={handleChange} required />
          </label>
          <div className="form-actions">
            <button type="submit">{editingId ? 'Update' : 'Create'}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(blank); }}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
        {message && <p className="muted">{message}</p>}
      </div>

      <div className="grid">
        {services.map((service) => (
          <div key={service.id} className="card">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p className="muted">{service.duration} minutes</p>
            <div className="card-actions">
              <button type="button" onClick={() => handleEdit(service)}>Edit</button>
              <button type="button" className="danger" onClick={() => handleDelete(service.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminServicesPage;
