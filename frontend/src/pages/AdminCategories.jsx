import { useState, useEffect } from 'react';
import { api } from '../api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.categories.list()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing('new');
    setForm({ name: '', slug: '', description: '' });
    setError('');
  };

  const openEdit = (c) => {
    setEditing(c._id);
    setForm({ name: c.name, slug: c.slug, description: c.description || '' });
    setError('');
  };

  const closeForm = () => {
    setEditing(null);
    setError('');
  };

  const slugFromName = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const save = async () => {
    setError('');
    const payload = { ...form };
    if (editing === 'new' && !payload.slug) payload.slug = slugFromName(payload.name);
    try {
      if (editing === 'new') {
        await api.categories.create(payload);
      } else {
        await api.categories.update(editing, payload);
      }
      closeForm();
      load();
    } catch (e) {
      setError(e.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this category? Products must not reference it.')) return;
    try {
      await api.categories.delete(id);
      load();
    } catch (e) {
      setError(e.message || 'Delete failed');
    }
  };

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading...</p>;

  return (
    <section>
      <h1 className="page-title">Admin — Categories</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {editing ? (
        <div className="card card-body" style={{ marginBottom: '1.5rem', maxWidth: '500px' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editing === 'new' ? 'New Category' : 'Edit Category'}</h3>
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editing === 'new' ? slugFromName(e.target.value) : f.slug }))} />
          </div>
          <div className="form-group">
            <label>Slug</label>
            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-primary" onClick={save}>Save</button>
            <button type="button" className="btn btn-secondary" onClick={closeForm}>Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn btn-primary" onClick={openCreate} style={{ marginBottom: '1rem' }}>Add Category</button>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.slug}</td>
                <td>{(c.description || '').slice(0, 50)}</td>
                <td>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(c)} style={{ marginRight: '0.5rem' }}>Edit</button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
