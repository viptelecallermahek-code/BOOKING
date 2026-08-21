const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection with retry logic
console.log('Attempting MongoDB connection with:', process.env.MONGODB_URI ? 'Atlas' : 'Local');

const connectDB = async (attempt = 1) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/goa-package-manager', {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
    });
    console.log('✅ MongoDB Connected Successfully on attempt', attempt);
  } catch (err) {
    console.log(`❌ MongoDB Connection Error (attempt ${attempt}):`, err.message);
    if (attempt < 5) {
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      console.log(`Retrying in ${delay}ms...`);
      setTimeout(() => connectDB(attempt + 1), delay);
    } else {
      console.log('⚠️ Failed to connect after 5 attempts. Server running without database.');
    }
  }
};

connectDB();

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/settings', require('./routes/settings'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Goa Package Manager Server running on port ${PORT}`);
});

module.exports = app;
