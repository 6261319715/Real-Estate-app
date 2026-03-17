const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/contact - Send message to seller
router.post('/', protect, async (req, res) => {
  try {
    const { propertyId, message, name, email, phone } = req.body;
    if (!propertyId || !message || !name || !email) {
      return res.status(400).json({ message: 'Please provide propertyId, message, name and email.' });
    }
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }
    const contact = await ContactMessage.create({
      property: propertyId,
      sender: req.user._id,
      seller: property.sellerId,
      message,
      name,
      email,
      phone: phone || '',
    });
    res.status(201).json({ message: 'Message sent to seller successfully.', contact });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// @route   GET /api/contact/my-messages - Messages received by logged-in seller
router.get('/my-messages', protect, async (req, res) => {
  try {
    const messages = await ContactMessage.find({ seller: req.user._id })
      .populate('property', 'title location price')
      .populate('sender', 'name email')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

module.exports = router;
