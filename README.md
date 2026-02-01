# Online store - Advanced Databases (MongoDB)  by Bolatov Dias BDA-2401

Web application for an **online store** with MongoDB as the primary database, a REST API backend, and a React frontend.

## Project Overview

- **Topic:** Online Store  
- **Type:** Web application (backend + frontend)  
- **Database:** MongoDB (NoSQL)  
- **Backend:** Node.js, Express, Mongoose  
- **Frontend:** React 18, Vite, React Router  

The application allows customers to browse products, add items to cart, place orders, and view order history. Administrators can manage products, categories, orders, and view aggregation-based sales statistics.

## System Architecture

```
┌─────────────────┐     HTTP/REST      ┌─────────────────┐     Mongoose      ┌─────────────────┐
│  React Frontend │ ◄────────────────► │  Express API    │ ◄────────────────►│    MongoDB      │
│(Vite, port 3000)│                   │  (port 5000)    │                   │  (online_store) │
└─────────────────┘                    └─────────────────┘                   └─────────────────┘
```

- **Frontend:** Single-page application (SPA) with client-side routing. Communicates with the backend via fetch to `/api/*`.  
- **Backend:** REST API with JWT authentication, role-based access (customer / admin), centralized error handling, and environment-based configuration.  
- **Database:** MongoDB with Mongoose ODM. Collections: `users`, `categories`, `products`, `orders`. Embedded documents (order items) and references (user, category, product).

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

API runs at `http://localhost:5000`.

### Seed data (optional)

```bash
cd backend
node src/scripts/seed.js
```

Creates:
- Admin: `admin@store.com` / `admin123`
- Customer: `user@store.com` / `user123`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000` and proxies `/api` to the backend.

## Deploying to GitHub Pages (with MongoDB)

**GitHub Pages serves only static files** (HTML/CSS/JS). It does **not** run Node.js or your Express backend, so you cannot run the full app on GitHub Pages alone.

To have the store work with MongoDB in production:

1. **Host the backend elsewhere** (e.g. [Render](https://render.com), [Railway](https://railway.app), [Fly.io](https://fly.io)) so your Express API runs 24/7.
2. **Use MongoDB Atlas** (or any MongoDB reachable from the internet) and set `MONGODB_URI` in the backend’s environment.
3. **Deploy the frontend to GitHub Pages**, and point it at your deployed API using the `VITE_API_URL` build variable.

Example: if your backend is at `https://my-store-api.onrender.com`, build the frontend with:

```bash
cd frontend
VITE_API_URL=https://my-store-api.onrender.com npm run build
```

## API Documentation

Base URL: `http://localhost:5000/api` (or relative `/api` when using frontend proxy).

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register (body: `email`, `password`, `name`) |
| POST | `/auth/login` | No | Login (body: `email`, `password`). Returns `token` and `user`. |

Protected routes require header: `Authorization: Bearer <token>`.

### Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | No | List all categories |
| GET | `/categories/:id` | No | Get category by ID |
| POST | `/categories` | Admin | Create category (body: `name`, `slug`, `description`) |
| PUT | `/categories/:id` | Admin | Update category |
| DELETE | `/categories/:id` | Admin | Delete category (fails if products reference it) |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | No | List products (query: `page`, `limit`, `category`, `minPrice`, `maxPrice`, `sort`) |
| GET | `/products/stats` | Admin | **Aggregation:** revenue and quantity by category, summary totals |
| GET | `/products/:id` | No | Get product by ID |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| PATCH | `/products/:id/stock` | Admin | Update stock (body: `amount`; uses `$inc`) |
| PATCH | `/products/:id/tags/add` | Admin | Add tag (body: `tag`; uses `$push`) |
| PATCH | `/products/:id/tags/remove` | Admin | Remove tag (body: `tag`; uses `$pull`) |
| DELETE | `/products/:id` | Admin | Delete product |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/orders` | Yes | List orders (own for customer, all for admin) |
| GET | `/orders/:id` | Yes | Get order by ID (own or admin) |
| POST | `/orders` | Yes | Create order (body: `items: [{ productId, quantity }]`, `shippingAddress`) |
| PUT | `/orders/:id/status` | Admin | Update order status (body: `status`) |
| DELETE | `/orders/:id` | Admin | Delete order (only pending/cancelled) |

## Database Schema Description

### Collections

**users**  
- `_id` (ObjectId), `email` (unique), `password` (hashed), `name`, `role` (`customer` \| `admin`), `createdAt`, `updatedAt`.

**categories**  
- `_id` (ObjectId), `name`, `slug` (unique), `description`, `createdAt`, `updatedAt`.

**products**  
- `_id` (ObjectId), `name`, `description`, `price`, `stock`, `category` (ref: Category), `images` (array of strings), `isActive`, `createdAt`, `updatedAt`.

**orders**  
- `_id` (ObjectId), `user` (ref: User), `items` (embedded array: `product` ref, `quantity`, `price`), `total`, `status` (`pending` \| `confirmed` \| `shipped` \| `delivered` \| `cancelled`), `shippingAddress` (object), `createdAt`, `updatedAt`.

### Data model notes

- **Referenced:** User, Category, Product are separate collections; orders reference `user` and `items[].product`; products reference `category`.  
- **Embedded:** Order line items (`items`) are embedded in the order document (product snapshot: quantity and price at order time).

## Indexing and Optimization Strategy

- **users:** Unique index on `email`; index on `role` for admin filtering.  
- **categories:** Unique index on `slug`; index on `name` for listing/sort.  
- **products:** Compound index `(category, isActive)` for filtered listing; text index on `name` and `description` for search; index on `price` for range queries; index on `createdAt` for sort.  
- **orders:** Compound index `(user, createdAt)` for user order history; index on `status`; index on `items.product` for product-level analytics.  

Aggregation pipeline for `GET /api/products/stats` uses `$match` (exclude cancelled), `$unwind` (items), `$lookup` (products and categories), `$group` by category, and `$sort` by revenue to keep the working set and I/O efficient.


## Project Structure

```
final/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/seed.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── README.md
├── REPORT.md
└── RUBRIC.md
```
