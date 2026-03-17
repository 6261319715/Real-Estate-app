# Real Estate Marketplace – Requirements

## System requirements

| Requirement | Version / notes |
|-------------|------------------|
| **Node.js** | 18.x or 20.x (LTS recommended) |
| **npm** | 9.x or 10.x (comes with Node) |
| **MongoDB** | 6.x or 7.x (local or Atlas) |
| **Browser** | Modern browser (Chrome, Firefox, Edge, Safari) |

---

## Backend dependencies (package.json)

| Package | Version | Purpose |
|---------|---------|---------|
| bcryptjs | ^2.4.3 | Password hashing |
| cors | ^2.8.5 | Cross-origin requests |
| dotenv | ^16.3.1 | Environment variables |
| express | ^4.18.2 | Web server |
| jsonwebtoken | ^9.0.2 | JWT auth |
| mongoose | ^8.0.3 | MongoDB ODM |
| multer | ^1.4.5-lts.1 | File uploads |
| nodemon | ^3.0.2 | Dev auto-reload (devDependency) |

---

## Frontend dependencies (package.json)

| Package | Version | Purpose |
|---------|---------|---------|
| axios | ^1.6.2 | HTTP client |
| react | ^18.2.0 | UI library |
| react-dom | ^18.2.0 | React DOM |
| react-router-dom | ^6.21.0 | Routing |
| @vitejs/plugin-react | ^4.2.1 | Vite React (dev) |
| autoprefixer | ^10.4.16 | CSS (dev) |
| postcss | ^8.4.32 | CSS (dev) |
| tailwindcss | ^3.4.0 | Styling (dev) |
| vite | ^5.0.8 | Build tool (dev) |

---

## Environment variables (backend)

Create `backend/.env` (copy from `backend/.env.example`):

| Variable | Required | Example |
|----------|----------|---------|
| PORT | No | 5000 (default) |
| MONGODB_URI | Yes | mongodb://localhost:27017/realestate |
| JWT_SECRET | Yes | any-long-random-string |
| NODE_ENV | No | development |

---

## One-time setup

1. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure backend**
   - Copy `backend/.env.example` to `backend/.env`
   - Set `MONGODB_URI` and `JWT_SECRET` in `backend/.env`

4. **Run MongoDB** (local or use Atlas URI in `MONGODB_URI`)
