# Real Estate Marketplace

Full-stack real estate marketplace with React frontend, Node.js/Express backend, and MongoDB.

## Features

- **User auth** – Sign up and login (buyer or seller)
- **Sellers** – Upload and manage properties
- **Buyers** – Browse listings with filters (type, location, price)
- **Property details** – Full listing page with description and seller info
- **Contact seller** – Logged-in users can send a message to the seller
- **Responsive design** – Mobile-first layout, collapsible nav on small screens
- **Loading states** – Spinners and labels for async actions
- **Error handling** – Error boundary, API error messages, retry where appropriate

## Project structure

```
Real Estate App/
├── backend/                 # Node.js + Express API
│   ├── config/              # DB connection
│   ├── middleware/          # Auth, file upload (multer)
│   ├── models/              # User, Property, ContactMessage
│   ├── routes/              # auth, properties, contact
│   ├── uploads/             # Uploaded property images (created at runtime)
│   ├── server.js
│   └── package.json
├── frontend/                # React (Vite) app
│   ├── src/
│   │   ├── api/             # Axios client (base URL, auth header)
│   │   ├── components/      # Navbar, PropertyCard, etc.
│   │   │   └── ui/          # Reusable UI: LoadingSpinner, ErrorMessage, ErrorBoundary
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Home, Login, Signup, PropertyDetails, AddProperty, ContactSeller
│   │   └── utils/           # helpers (getErrorMessage, getImageSrc)
│   └── package.json
└── README.md
```

## Requirements

- **Node.js** 18+ and **npm**
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

See **[REQUIREMENTS.md](REQUIREMENTS.md)** for full list of dependencies and env variables.

## Setup

### 1. Install dependencies

**Option A – one command (from project root)**  
- Windows: `install-dependencies.bat`  
- Mac/Linux: `./install-dependencies.sh`

**Option B – manually**
```bash
cd backend && npm install && cd ..
cd frontend && npm install
```

### 2. MongoDB

Install and run MongoDB locally, or use Atlas and set `MONGODB_URI` in `backend/.env`.

A default `backend/.env` is provided; edit it to set `MONGODB_URI` (and optionally `JWT_SECRET`).

### 3. Run backend

```bash
cd backend
npm run dev
```

API runs at `http://localhost:5000`.

### 4. Run frontend (new terminal)

```bash
cd frontend
npm run dev
```

App runs at `http://localhost:3000`. Vite proxies `/api` and `/uploads` to the backend.

### 5. (Optional) Add dummy data

To populate the database with sample properties and a demo seller account:

```bash
cd backend
npm run seed
```

Demo seller login: **demo@seller.com** / **demo1234**

## Environment variables

**Backend (`.env`):**

| Variable     | Description                    |
|-------------|--------------------------------|
| PORT        | Server port (default 5000)     |
| MONGODB_URI | MongoDB connection string      |
| JWT_SECRET  | Secret for JWT signing         |
| NODE_ENV    | `development` or `production`  |

## API overview

| Method | Endpoint              | Description        |
|--------|------------------------|--------------------|
| POST   | /api/auth/signup       | Register            |
| POST   | /api/auth/login        | Login               |
| GET    | /api/auth/me           | Current user (auth) |
| GET    | /api/property          | List properties     |
| GET    | /api/property/:id      | One property        |
| POST   | /api/property/add      | Create (seller)     |
| PUT    | /api/property/:id      | Update (seller)     |
| DELETE | /api/property/:id      | Delete (seller)     |
| POST   | /api/contact           | Contact seller      |
| GET    | /api/contact/my-messages | Inbox (seller)    |

## Scripts

- **Backend:** `npm start` (run), `npm run dev` (nodemon)
- **Frontend:** `npm run dev`, `npm run build`, `npm run preview`
