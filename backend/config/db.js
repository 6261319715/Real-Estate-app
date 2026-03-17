const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is missing. Check backend/.env');
    process.exit(1);
  }
  const isAtlas = uri.includes('mongodb+srv');
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    if (error.message.includes('ECONNREFUSED') && !isAtlas) {
      console.error('Make sure MongoDB is running (e.g. run "mongod" or start MongoDB service).');
    }
    if (isAtlas) {
      console.error('If using Atlas: 1) Replace REPLACE_WITH_YOUR_PASSWORD in backend/.env with your real DB password. 2) In Atlas, add your IP in Network Access (or 0.0.0.0/0 for testing).');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
