/**
 * Property API
 * - POST   /api/property/add   – Add property (sellers only)
 * - GET    /api/property       – List properties (public)
 * - GET    /api/property/:id   – Get one property (public)
 * - PUT    /api/property/:id   – Update property (seller, own only)
 * - DELETE /api/property/:id   – Delete property (seller, own only)
 */
const express = require('express');
const Property = require('../models/Property');
const { protect, sellerOnly } = require('../middleware/auth');
const { uploadPropertyImages } = require('../middleware/upload');

const router = express.Router();

// GET /api/property/my-listings – Current seller's properties (protected)
router.get('/my-listings', protect, sellerOnly, async (req, res) => {
  try {
    const properties = await Property.find({ sellerId: req.user._id })
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// GET /api/property – List all properties (public)
router.get('/', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, location } = req.query;
    const filter = {};
    if (type) filter.propertyType = type;
    if (minPrice != null || maxPrice != null) {
      filter.price = {};
      if (minPrice != null) filter.price.$gte = Number(minPrice);
      if (maxPrice != null) filter.price.$lte = Number(maxPrice);
    }
    if (location) filter.location = new RegExp(location, 'i');

    const properties = await Property.find(filter)
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// GET /api/property/:id – Single property (public)
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('sellerId', 'name email');
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// POST /api/property/add – Create property (sellers only); accepts multipart/form-data with multiple images
router.post('/add', protect, sellerOnly, uploadPropertyImages, async (req, res) => {
  try {
    const { title, description, price, location, propertyType } = req.body;
    if (!title || !description || !price || !location || !propertyType) {
      return res.status(400).json({ message: 'Please provide title, description, price, location and property type.' });
    }
    const maxListings = req.user.planId?.maxListings ?? 3;
    const currentCount = await Property.countDocuments({ sellerId: req.user._id });
    if (currentCount >= maxListings) {
      return res.status(403).json({
        message: `Listing limit reached (${maxListings} on your current plan). Upgrade to add more properties.`,
        code: 'LISTING_LIMIT',
      });
    }
    const imagePaths = (req.files || []).map((f) => '/uploads/' + f.filename);
    const property = await Property.create({
      title,
      description,
      price: Number(price),
      location,
      propertyType,
      images: imagePaths,
      sellerId: req.user._id,
    });
    const populated = await Property.findById(property._id).populate('sellerId', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// PUT /api/property/:id – Update property (seller, own only)
router.put('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    if (property.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own properties.' });
    }
    const allowed = ['title', 'description', 'price', 'location', 'propertyType', 'images'];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) property[key] = req.body[key];
    });
    await property.save();
    const populated = await Property.findById(property._id).populate('sellerId', 'name email');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// DELETE /api/property/:id – Delete property (seller, own only)
router.delete('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    if (property.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own properties.' });
    }
    await property.deleteOne();
    res.json({ message: 'Property removed.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

module.exports = router;
