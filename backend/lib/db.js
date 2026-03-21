const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set. Please configure it in environment variables.');
}
if (
  process.env.VERCEL === '1' &&
  /localhost|127\.0\.0\.1/i.test(MONGODB_URI)
) {
  throw new Error(
    'Invalid MONGODB_URI for Vercel. Use a cloud MongoDB URI (MongoDB Atlas), not localhost.'
  );
}

const globalCache = globalThis;

if (!globalCache.__mongooseCache) {
  globalCache.__mongooseCache = {
    conn: null,
    promise: null,
    hasLoggedReady: false,
  };
}

const cached = globalCache.__mongooseCache;

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongooseInstance) => {
        if (!cached.hasLoggedReady) {
          console.log(`MongoDB connected: ${mongooseInstance.connection.host}`);
          cached.hasLoggedReady = true;
        }
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        console.error('MongoDB connection failed:', error.message);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
