/**
 * Plans API – Subscription tiers for SaaS
 * - GET /api/plans – List all plans (public)
 */
const express = require('express');
const Plan = require('../models/Plan');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find().sort({ priceMonthly: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

module.exports = router;
