import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    api.products.get(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((i) => i.productId === id);
    const q = Math.min(quantity, product?.stock ?? 0);
    if (q < 1) {
      setError('Invalid quantity');
      return;
    }
    if (existing) existing.quantity += q;
    else cart.push({ productId: id, quantity: q });
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setAddedMessage(true);
    setTimeout(() => navigate('/cart'), 1200);
  };

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading...</p>;
  if (!product) return <div className="empty-state"><div className="empty-state-icon" aria-hidden="true">📦</div><p>Product not found.</p></div>;

  return (
    <section>
      <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); navigate(-1); }}>← Back</a>
      <div className="detail-layout">
        <div className="card product-detail-img-wrap">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="product-detail-img" />
          ) : (
            <span style={{ fontSize: '4rem' }}>📦</span>
          )}
        </div>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>{product.name}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{product.description || 'No description.'}</p>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p id="product-stock" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Stock: {product.stock}</p>
          {error && <div className="alert alert-error" role="alert" aria-live="polite">{error}</div>}
          {addedMessage && <div className="alert alert-success" role="status" aria-live="polite">Added to cart! Taking you to cart…</div>}
          <div className="form-group" style={{ maxWidth: '200px', marginBottom: '1rem' }}>
            <label htmlFor="product-quantity">Quantity</label>
            <input
              id="product-quantity"
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              aria-describedby="product-stock"
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={addToCart} disabled={product.stock < 1 || addedMessage}>
            {addedMessage ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </section>
  );
}
