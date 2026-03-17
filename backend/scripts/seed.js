/**
 * Seed database with dummy data (demo seller + sample properties).
 * Run: node scripts/seed.js
 * Requires: MONGODB_URI in .env
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
const Plan = require('../models/Plan');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate';

const defaultPlans = [
  { name: 'Free', slug: 'free', maxListings: 3, priceMonthly: 0, priceYearly: 0, isDefault: true, features: ['3 property listings', 'Basic support', 'Public listing page'] },
  { name: 'Pro', slug: 'pro', maxListings: 10, priceMonthly: 29, priceYearly: 290, isDefault: false, features: ['10 property listings', 'Priority support', 'Featured listings', 'Analytics'] },
  { name: 'Enterprise', slug: 'enterprise', maxListings: 999, priceMonthly: 99, priceYearly: 990, isDefault: false, features: ['Unlimited listings', 'Dedicated support', 'API access', 'Custom branding'] },
];

const dummyProperties = [
  {
    title: 'Modern 3-Bedroom House with Garden',
    description: 'Spacious family home in a quiet neighborhood. Features a large backyard, modern kitchen with stainless steel appliances, and a cozy living room with fireplace. Master bedroom has en-suite bathroom. Close to schools and parks.',
    price: 350000,
    location: 'Downtown Seattle, WA',
    propertyType: 'house',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
  },
  {
    title: 'Luxury Downtown Apartment',
    description: 'Stunning high-rise apartment with panoramic city views. Open-plan living area, premium finishes, and access to building amenities including gym, pool, and concierge. Perfect for professionals.',
    price: 485000,
    location: 'Manhattan, New York',
    propertyType: 'flat',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
  },
  {
    title: 'Cozy 2-Bed Flat Near Metro',
    description: 'Bright and welcoming flat just 5 minutes from the metro. Recently renovated with new flooring and paint. Ideal for first-time buyers or small families. Low maintenance fees.',
    price: 220000,
    location: 'Brooklyn, NY',
    propertyType: 'flat',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
  },
  {
    title: 'Riverside Land – Build Your Dream Home',
    description: 'Prime 1.2 acre plot with river frontage. Cleared and ready for construction. Utilities available at the road. Peaceful setting with mature trees. Ideal for custom build.',
    price: 189000,
    location: 'Austin, TX',
    propertyType: 'land',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800'],
  },
  {
    title: 'Family Home with Pool',
    description: 'Four-bedroom home featuring a private pool and outdoor entertainment area. Large kitchen, formal dining room, and study. Located in a top-rated school district.',
    price: 520000,
    location: 'San Diego, CA',
    propertyType: 'house',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'],
  },
  {
    title: 'Charming Cottage with Garden',
    description: 'Quaint two-bedroom cottage with a beautiful garden and patio. Perfect for retirees or small families. Walking distance to shops and cafes. Recently updated roof and HVAC.',
    price: 275000,
    location: 'Portland, OR',
    propertyType: 'house',
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
  },
  {
    title: 'Investment Land – Commercial Potential',
    description: '2.5 acres on main road with high visibility. Zoned for mixed use. Great opportunity for development or commercial project. All surveys and reports available.',
    price: 420000,
    location: 'Phoenix, AZ',
    propertyType: 'land',
    images: ['https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800'],
  },
  {
    title: 'Penthouse with Terrace',
    description: 'Stunning penthouse with private rooftop terrace and city skyline views. Three bedrooms, three bathrooms, and premium appliances throughout. Building has 24/7 security.',
    price: 895000,
    location: 'Miami, FL',
    propertyType: 'flat',
    images: ['https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'],
  },
  {
    title: 'Suburban 4-Bed Family Home',
    description: 'Spacious four-bedroom home in a friendly suburb. Large driveway, double garage, and a deck overlooking the garden. Open-plan kitchen-diner, separate lounge, and utility room. Excellent schools nearby.',
    price: 395000,
    location: 'Denver, CO',
    propertyType: 'house',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'],
  },
  {
    title: 'Studio Flat – City Center',
    description: 'Compact, modern studio in the heart of the city. Perfect for students or young professionals. Recently refurbished with new kitchen and bathroom. Secure entry and bike storage.',
    price: 165000,
    location: 'Chicago, IL',
    propertyType: 'flat',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
  },
  {
    title: 'Wooded Building Plot',
    description: 'Half-acre wooded lot ready for your dream home. Secluded yet minutes from town. Power and water at the boundary. Ideal for a custom build or cabin.',
    price: 95000,
    location: 'Nashville, TN',
    propertyType: 'land',
    images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800'],
  },
  {
    title: 'Victorian Townhouse',
    description: 'Character three-storey townhouse with original features. High ceilings, period fireplaces, and a private rear garden. Walking distance to transport and amenities.',
    price: 620000,
    location: 'Boston, MA',
    propertyType: 'house',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const plan of defaultPlans) {
      const exists = await Plan.findOne({ slug: plan.slug });
      if (!exists) {
        await Plan.create(plan);
        console.log('Created plan:', plan.name);
      }
    }

    const defaultPlan = await Plan.findOne({ isDefault: true });
    let seller = await User.findOne({ email: 'demo@seller.com' });
    if (!seller) {
      seller = await User.create({
        name: 'Demo Seller',
        email: 'demo@seller.com',
        password: 'demo1234',
        role: 'seller',
        planId: defaultPlan?._id,
      });
      console.log('Created demo seller: demo@seller.com / demo1234');
    } else {
      if (!seller.planId && defaultPlan) {
        seller.planId = defaultPlan._id;
        await seller.save();
      }
      console.log('Using existing demo seller');
    }

    for (const prop of dummyProperties) {
      const exists = await Property.findOne({
        title: prop.title,
        sellerId: seller._id,
      });
      if (!exists) {
        await Property.create({
          ...prop,
          sellerId: seller._id,
        });
        console.log('Added:', prop.title);
      }
    }

    console.log('Seed completed.');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
