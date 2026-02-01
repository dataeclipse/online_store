import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { formatPrice } from '../utils/formatPrice';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders.get(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading...</p>;
  if (!order) return <div className="empty-state"><div className="empty-state-icon" aria-hidden="true">📋</div><p>Order not found.</p></div>;

  return (
    <section>
      <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); navigate(-1); }}>← Back to Orders</a>
      <h1 className="page-title">Order {order._id.slice(-8)}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
        {new Date(order.createdAt).toLocaleString()} · Status: <span className={`status-badge ${order.status}`}>{order.status}</span>
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, i) => (
              <tr key={i}>
                <td>{item.product?.name || 'Product'}</td>
                <td>{formatPrice(item.price)}</td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontWeight: 700, fontSize: '1.1rem' }}>Total: {formatPrice(order.total)}</p>
    </section>
  );
}
