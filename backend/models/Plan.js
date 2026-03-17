const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  maxListings: {
    type: Number,
    required: true,
    default: 3,
  },
  priceMonthly: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  priceYearly: {
    type: Number,
    default: 0,
    min: 0,
  },
  features: [{
    type: String,
    trim: true,
  }],
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Plan', planSchema);
