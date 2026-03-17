# Troubleshooting – "Server error"

When you see **"Server error"** in the app or a 500 response:

## 1. Check the **backend terminal**

The backend now logs every error. Look at the terminal where you ran `npm run dev` (in the `backend` folder). You should see a line like:

```
Server error: <actual error message>
```

That message tells you what went wrong.

---

## 2. Common causes

| What you see in backend terminal | Fix |
|-----------------------------------|-----|
| **MongoDB connection failed** / ECONNREFUSED | Start MongoDB: run `mongod` or start the MongoDB service. On Windows: start "MongoDB Server" from Services. |
| **MONGODB_URI is not set** | Create `backend/.env` from `backend/.env.example` and set `MONGODB_URI=mongodb://localhost:27017/realestate` |
| **JWT_SECRET is not set** | Add to `backend/.env`: `JWT_SECRET=any-long-random-string` |
| **Port 5000 is already in use** | Close the other app using port 5000, or set `PORT=5001` in `backend/.env` |
| **EADDRINUSE** | Same as above – change `PORT` in `.env` or stop the process on that port |

---

## 3. Quick checks

1. **Backend running?**  
   Open http://localhost:5000/api/health in the browser.  
   You should see: `{"ok":true}`  
   If not, the backend is not running or not reachable.

2. **MongoDB running?**  
   When you start the backend, the first line should be:  
   `MongoDB Connected: ...`  
   If you see `MongoDB connection failed` instead, start MongoDB or fix `MONGODB_URI` in `.env`.

3. **Frontend pointing to backend?**  
   Use the app at http://localhost:3000 (Vite proxies `/api` to the backend).  
   Do not call http://localhost:5000 directly from the frontend in production; for local dev, the proxy is correct.

---

## 4. Restart clean

1. Stop both backend and frontend (Ctrl+C in each terminal).
2. Start MongoDB if you use it locally.
3. In `backend`: `npm run dev` – wait for "MongoDB Connected" and "Server running on port 5000".
4. In `frontend`: `npm run dev` – open http://localhost:3000.

If the error persists, copy the **exact line** from the backend terminal that says `Server error: ...` and use it to debug or ask for help.
