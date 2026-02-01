const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Backend unavailable. Start the server: cd backend && npm run dev');
    }
    throw err;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || res.statusText;
    if (res.status === 502 || res.status === 503 || res.status === 504 || (res.status === 500 && /internal server error|proxy|econnrefused/i.test(msg))) {
      throw new Error('Server is starting or unavailable. Please try again in a moment.');
    }
    throw new Error(msg);
  }
  return data;
}

export const api = {
  auth: {
    register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  },
  categories: {
    list: () => request('/categories'),
    get: (id) => request(`/categories/${id}`),
    create: (body) => request('/categories', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
  },
  products: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/products${q ? `?${q}` : ''}`);
    },
    get: (id) => request(`/products/${id}`),
    create: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    updateStock: (id, amount) => request(`/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ amount }) }),
    delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
    stats: () => request('/products/stats'),
  },
  orders: {
    list: () => request('/orders'),
    get: (id) => request(`/orders/${id}`),
    create: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
    updateStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    delete: (id) => request(`/orders/${id}`, { method: 'DELETE' }),
  },
};

export function setToken(token) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

export function getStoredUser() {
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) localStorage.setItem('user', JSON.stringify(user));
  else localStorage.removeItem('user');
}
