import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { formatPrice } from '../utils/formatPrice';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(raw);
    if (raw.length === 0) {
      setLoading(false);
      return;
    }
    Promise.all(raw.map((i) => api.products.get(i.productId)))
      .then((results) => {
        const map = {};
        raw.forEach((item, idx) => {
          map[item.productId] = { ...results[idx], quantity: item.quantity };
        });
        setProducts(map);
      })
      .catch(() => setProducts({}))
      .finally(() => setLoading(false));
  }, []);

  const updateQty = (productId, delta) => {
    const next = cart.map((i) =>
      i.productId === productId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    ).filter((i) => i.quantity > 0);
    setCart(next);
    localStorage.setItem('cart', JSON.stringify(next));
    window.dispatchEvent(new Event('cart-updated'));
    if (products[productId]) {
      setProducts((p) => ({
        ...p,
        [productId]: { ...p[productId], quantity: next.find((x) => x.productId === productId)?.quantity ?? 0 },
      }));
    }
  };

  const removeItem = (productId, productName) => {
    if (!window.confirm(`Remove "${productName}" from cart?`)) return;
    const next = cart.filter((i) => i.productId !== productId);
    setCart(next);
    setProducts((p) => {
      const copy = { ...p };
      delete copy[productId];
      return copy;
    });
    localStorage.setItem('cart', JSON.stringify(next));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const items = Object.entries(products).filter(([, p]) => p && p.quantity > 0);
  const total = items.reduce((sum, [, p]) => sum + (p.price || 0) * (p.quantity || 0), 0);

  const placeOrder = async () => {
    if (items.length === 0) {
      setError('Cart is empty');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.orders.create({
        items: items.map(([productId, p]) => ({ productId, quantity: p.quantity })),
        shippingAddress: {},
      });
      localStorage.setItem('cart', JSON.stringify([]));
      setCart([]);
      setProducts({});
      window.dispatchEvent(new Event('cart-updated'));
      navigate('/orders');
    } catch (e) {
      setError(e.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading cart...</p>;

  return (
    <section>
      <h1 className="page-title">Cart</h1>
      {error && (
        <div className="alert alert-error" role="alert" aria-live="polite">
          {error}
        </div>
      )}
      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">🛒</div>
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(([id, p]) => (
                  <tr key={id}>
                    <td>{p.name}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => updateQty(id, -1)}>−</button>
                      <span style={{ margin: '0 0.75rem' }}>{p.quantity}</span>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => updateQty(id, 1)} disabled={p.quantity >= (p.stock ?? 0)}>+</button>
                    </td>
                    <td>{formatPrice(p.price * p.quantity)}</td>
                    <td>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(id, p.name)} aria-label={`Remove ${p.name} from cart`}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cart-total-row">
            <strong>Total: {formatPrice(total)}</strong>
            <button type="button" className="btn btn-primary" onClick={placeOrder} disabled={submitting} aria-busy={submitting}>
              {submitting ? 'Placing order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
