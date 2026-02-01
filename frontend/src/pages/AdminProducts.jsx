import { useState, useEffect } from 'react';
import { api } from '../api';
import { formatPrice } from '../utils/formatPrice';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0, category: '', isActive: true });
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      api.products.list({ limit: 100 }),
      api.categories.list(),
    ])
      .then(([res, cats]) => {
        setProducts(res.data || []);
        setCategories(cats || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing('new');
    setForm({ name: '', description: '', price: 0, stock: 0, category: categories[0]?._id || '', isActive: true });
    setError('');
  };

  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      stock: p.stock,
      category: p.category?._id || p.category,
      isActive: p.isActive !== false,
    });
    setError('');
  };

  const closeForm = () => {
    setEditing(null);
    setError('');
  };

  const save = async () => {
    setError('');
    try {
      if (editing === 'new') {
        await api.products.create(form);
      } else {
        await api.products.update(editing, form);
      }
      closeForm();
      load();
    } catch (e) {
      setError(e.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.products.delete(id);
      load();
    } catch (e) {
      setError(e.message || 'Delete failed');
    }
  };

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading...</p>;

  return (
    <section>
      <h1 className="page-title">Admin — Products</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {editing ? (
        <div className="card card-body" style={{ marginBottom: '1.5rem', maxWidth: '500px' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editing === 'new' ? 'New Product' : 'Edit Product'}</h3>
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: parseInt(e.target.value, 10) || 0 }))} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-primary" onClick={save}>Save</button>
            <button type="button" className="btn btn-secondary" onClick={closeForm}>Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn btn-primary" onClick={openCreate} style={{ marginBottom: '1rem' }}>Add Product</button>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{formatPrice(p.price)}</td>
                <td>{p.stock}</td>
                <td>{p.category?.name || p.category}</td>
                <td>{p.isActive !== false ? 'Yes' : 'No'}</td>
                <td>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(p)} style={{ marginRight: '0.5rem' }}>Edit</button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
