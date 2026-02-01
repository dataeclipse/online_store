import { useState, useEffect } from 'react';
import { api } from '../api';
import { formatPrice } from '../utils/formatPrice';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.orders.list()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    setError('');
    try {
      await api.orders.updateStatus(id, status);
      load();
    } catch (e) {
      setError(e.message || 'Update failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this order? (Only pending/cancelled allowed)')) return;
    setError('');
    try {
      await api.orders.delete(id);
      load();
    } catch (e) {
      setError(e.message || 'Delete failed');
    }
  };

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading...</p>;

  return (
    <section>
      <h1 className="page-title">Admin — Orders</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {orders.length === 0 ? (
        <div className="empty-state"><p>No orders.</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id.slice(-8)}</td>
                  <td>{o.user?.name || o.user?.email || '-'}</td>
                  <td>{formatPrice(o.total)}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      style={{ padding: '0.35rem', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 'var(--radius)' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(o._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
