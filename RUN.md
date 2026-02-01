# How to Run the Online Store

## Quick start (one command)

From the **project root** (`final` folder), run:

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000) in one terminal. Open http://localhost:3000 in your browser. Make sure MongoDB is running (local or Atlas) and `backend/.env` has your `MONGODB_URI`.

---

## Step-by-step (two terminals)

If you prefer to run backend and frontend separately:

## 1. MongoDB - choose one

### MongoDB Atlas (cloud)

1. Go to https://www.mongodb.com/cloud/atlas and create a free cluster.
2. Create a database user (username + password).
3. In Network Access, add your IP (or `0.0.0.0/0` for testing).
4. Click **Connect** → **Drivers** → copy the connection string.
5. Replace `<password>` with your user password and set the database name to `online_store`:
   - Example: `mongodb+srv://user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/online_store`

---

## 2. Backend

Open a terminal in the project folder:

```bash
cd backend
```

Create your environment file (copy from example and edit):

```bash
copy .env.example .env
```

Edit `.env` and set:

- **MONGODB_URI** - your connection string (local or Atlas).
- **JWT_SECRET** - any long random string (e.g. `mySecretKey123`).

Example `.env` for local MongoDB:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online_store
JWT_SECRET=mySecretKey123
NODE_ENV=development
```

Install dependencies and start the server:

```bash
npm install
npm run dev
```

You should see: `MongoDB connected` and `Server running on http://localhost:5000`.

**Optional - seed sample data (admin + user + categories + products):**

```bash
node src/scripts/seed.js
```

Then use: **admin@store.com** / **admin123** or **user@store.com** / **user123**.

**Important:** Leave this terminal open. The backend must stay running while you use the app.

---

## 3. Frontend

Open a **second** terminal in the project folder (keep the backend running in the first):

```bash
cd frontend
npm install
npm run dev
```

Browser will open at **http://localhost:3000** (or open it manually). The frontend proxies `/api` to the backend.
