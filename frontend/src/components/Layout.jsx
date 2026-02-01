import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getCartCount() {
  try {
    const raw = JSON.parse(localStorage.getItem('cart') || '[]');
    return raw.reduce((sum, i) => sum + (i.quantity || 0), 0);
  } catch {
    return 0;
  }
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(getCartCount);

  useEffect(() => {
    const update = () => setCartCount(getCartCount());
    update();
    window.addEventListener('storage', update);
    window.addEventListener('cart-updated', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('cart-updated', update);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = (path) => {
    const base = 'nav-link';
    return location.pathname === path ? `${base} nav-link-active` : base;
  };

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <header className="app-header">
        <div className="container">
          <Link to="/" className="brand">Online store</Link>
          <nav>
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/products" className={navLinkClass('/products')}>Products</Link>
            {user ? (
              <>
                <Link to="/cart" className={navLinkClass('/cart')}>
                  Cart
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
                <Link to="/orders" className={navLinkClass('/orders')}>My Orders</Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/products">Admin Products</Link>
                    <Link to="/admin/categories">Admin Categories</Link>
                    <Link to="/admin/orders">Admin Orders</Link>
                    <Link to="/admin/stats">Stats</Link>
                  </>
                )}
                <span style={{ color: 'var(--muted)' }}>{user.name}</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="app-footer">
        <div className="container">
          <p className="watermark">
            by <a href="https://github.com/dataeclipse" target="_blank" rel="noopener noreferrer">github.com/dataeclipse</a>
          </p>
        </div>
      </footer>
    </>
  );
}
