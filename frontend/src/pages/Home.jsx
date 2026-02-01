import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section>
      <div className="hero">
        <h1>Welcome to Online store</h1>
        <p>
          Browse products, add to cart, and place orders. Everything you need in one place.
        </p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
      <div className="feature-cards">
        <Link to="/products" className="feature-card">
          <span className="feature-icon" aria-hidden="true">📦</span>
          <h3>Products</h3>
          <p>View all products and categories</p>
        </Link>
        <Link to="/cart" className="feature-card">
          <span className="feature-icon" aria-hidden="true">🛒</span>
          <h3>Cart</h3>
          <p>Review items and checkout (login required)</p>
        </Link>
        <Link to="/orders" className="feature-card">
          <span className="feature-icon" aria-hidden="true">📋</span>
          <h3>My Orders</h3>
          <p>Track your order history (login required)</p>
        </Link>
      </div>
    </section>
  );
}
