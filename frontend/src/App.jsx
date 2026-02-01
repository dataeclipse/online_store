import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminOrders from './pages/AdminOrders';
import AdminStats from './pages/AdminStats';
import OrderDetail from './pages/OrderDetail';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

const TITLES = {
  '/': 'Home',
  '/products': 'Products',
  '/cart': 'Cart',
  '/orders': 'My Orders',
  '/login': 'Login',
  '/register': 'Register',
  '/admin/products': 'Admin · Products',
  '/admin/categories': 'Admin · Categories',
  '/admin/orders': 'Admin · Orders',
  '/admin/stats': 'Admin · Stats',
};

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const base = location.pathname.split('/').slice(0, -1).join('/') || location.pathname;
    const titleKey = Object.keys(TITLES).find((k) => location.pathname === k || (location.pathname.startsWith(k + '/') && k !== '/'));
    const title = titleKey ? TITLES[titleKey] : 'Online store';
    document.title = `${title} | Online store`;
  }, [location.pathname]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/stats" element={<AdminRoute><AdminStats /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
