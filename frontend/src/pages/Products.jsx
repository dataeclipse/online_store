import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { formatPrice } from '../utils/formatPrice';

export default function Products() {
  const [data, setData] = useState({ data: [], pagination: {} });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    setApiError('');
    api.categories.list().then(setCategories).catch((e) => setApiError(e.message || 'Failed to load categories'));
  }, []);

  useEffect(() => {
    setLoading(true);
    setApiError('');
    const params = { page, limit: 12 };
    if (category) params.category = category;
    api.products.list(params)
      .then(setData)
      .catch((e) => {
        setData({ data: [], pagination: {} });
        setApiError(e.message || 'Failed to load products');
      })
      .finally(() => setLoading(false));
  }, [page, category]);

  const fetchProducts = () => {
    setLoading(true);
    setApiError('');
    const params = { page, limit: 12 };
    if (category) params.category = category;
    api.products.list(params)
      .then(setData)
      .catch((e) => {
        setData({ data: [], pagination: {} });
        setApiError(e.message || 'Failed to load products');
      })
      .finally(() => setLoading(false));
  };

  const { data: products = [], pagination = {} } = data;

  const skeletonCards = Array.from({ length: 8 }, (_, i) => (
    <div key={i} className="card product-card skeleton-card" style={{ pointerEvents: 'none' }}>
      <div className="skeleton skeleton-thumb" />
      <div style={{ padding: '1rem' }}>
        <div className="skeleton skeleton-line" style={{ height: '1.05rem' }} />
        <div className="skeleton skeleton-line" style={{ marginTop: '0.5rem', width: '40%' }} />
      </div>
    </div>
  ));

  return (
    <section>
      <h1 className="page-title">Products</h1>
      {apiError && (
        <div className="alert alert-error" role="alert" aria-live="polite" style={{ marginBottom: '1rem' }}>
          {apiError}
          <button type="button" className="btn btn-secondary btn-sm" onClick={fetchProducts} style={{ marginTop: '0.5rem' }}>
            Try again
          </button>
        </div>
      )}
      <div className="filters-bar">
        <label htmlFor="products-category">Category</label>
        <select
          id="products-category"
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="grid grid-4">{skeletonCards}</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">📦</div>
          <p>No products found.</p>
          <Link to="/products" className="btn btn-primary">View all categories</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-4">
            {products.map((p) => (
              <Link key={p._id} to={`/products/${p._id}`} className="card product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="thumb">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling?.classList.remove('hide'); }}
                    />
                  ) : null}
                  <span className="thumb-placeholder hide" style={{ display: p.images?.[0] ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '2.5rem' }}>📦</span>
                </div>
                <div className="info">
                  <h3>{p.name}</h3>
                  <span className="price">{formatPrice(p.price)}</span>
                </div>
              </Link>
            ))}
          </div>
          {(pagination.pages ?? 0) > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((x) => x - 1)}
              >
                Previous
              </button>
              <span className="page-info">
                Page {page} of {pagination.pages ?? 1}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page >= (pagination.pages ?? 1)}
                onClick={() => setPage((x) => x + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
