/**
 * Auth API – JWT authentication, passwords hashed with bcrypt (User model)
 * - POST /api/auth/signup – register, returns user + token
 * - POST /api/auth/login  – login, returns user + token
 * - GET  /api/auth/me     – current user (Bearer token required)
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Plan = require('../models/Plan');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password.' });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    const defaultPlan = await Plan.findOne({ isDefault: true });
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'buyer',
      planId: defaultPlan?._id || null,
    });
    const token = generateToken(user._id);
    const populated = await User.findById(user._id).populate('planId').select('-password');
    res.status(201).json({
      ...populated.toObject(),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = generateToken(user._id);
    const populated = await User.findById(user._id).populate('planId').select('-password');
    res.json({
      ...populated.toObject(),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

module.exports = router;
