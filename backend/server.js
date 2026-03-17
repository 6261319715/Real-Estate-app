/**
 * Real Estate Marketplace - Backend
 * - Express server
 * - MongoDB via Mongoose (config/db.js)
 * - Environment variables via dotenv
 * - CORS enabled for frontend
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const fs = require('fs');

// Check required env before starting
if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in .env');
  console.error('Create backend/.env from .env.example and set MONGODB_URI (e.g. mongodb://localhost:27017/realestate)');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not set in .env');
  console.error('Add JWT_SECRET to backend/.env (any long random string for development)');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const contactRoutes = require('./routes/contact');
const plansRoutes = require('./routes/plans');

// Connect to MongoDB
connectDB();

const app = express();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/plans', plansRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Error handler (e.g. multer file type/size errors, async route errors)
app.use((err, req, res, next) => {
  console.error('Server error:', err.message || err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Max 5MB per image.' });
  }
  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || 'Server error.' });
});

// Log unhandled promise rejections (helps debug "server error")
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`ERROR: Port ${PORT} is already in use. Stop the other process or set PORT in .env`);
  } else {
    console.error('Server failed to start:', err.message);
  }
  process.exit(1);
});
