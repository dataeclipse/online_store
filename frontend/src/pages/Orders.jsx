import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { formatPrice } from '../utils/formatPrice';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders.list()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading orders...</p>;

  return (
    <section>
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">📋</div>
          <p>You have no orders yet.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id.slice(-8)}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>{formatPrice(o.total)}</td>
                  <td><span className={`status-badge ${o.status}`}>{o.status}</span></td>
                  <td><Link to={`/orders/${o._id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
