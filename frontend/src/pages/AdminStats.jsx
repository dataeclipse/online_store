import { useState, useEffect } from 'react';
import { api } from '../api';
import { formatPrice } from '../utils/formatPrice';

export default function AdminStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.products.stats()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading...</p>;
  if (!data) return <div className="empty-state"><p>Failed to load stats.</p></div>;

  const { byCategory = [], summary = {} } = data;

  return (
    <section>
      <h1 className="page-title">Sales Statistics (Aggregation)</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
        Revenue and quantity by category (multi-stage aggregation pipeline).
      </p>
      <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card card-body">
          <h3 style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Orders</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{summary.totalOrders ?? 0}</p>
        </div>
        <div className="card card-body">
          <h3 style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Revenue</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
            {formatPrice(summary.totalRevenue || 0)}
          </p>
        </div>
        <div className="card card-body">
          <h3 style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Avg Order Value</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatPrice(summary.avgOrderValue || 0)}</p>
        </div>
      </div>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>By Category</h2>
      {byCategory.length === 0 ? (
        <div className="empty-state"><p>No order data by category yet.</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Quantity</th>
                <th>Revenue</th>
                <th>Order Count</th>
              </tr>
            </thead>
            <tbody>
              {byCategory.map((row, i) => (
                <tr key={i}>
                  <td>{row.categoryName || '-'}</td>
                  <td>{row.totalQuantity ?? 0}</td>
                  <td>{formatPrice(row.totalRevenue || 0)}</td>
                  <td>{row.orderCount ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
