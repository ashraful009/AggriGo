import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import businessDataRoutes from './routes/businessData.js';
import uploadRoutes from './routes/upload.js';
import profileRoutes from './routes/profile.js';
import galleryRoutes from './routes/gallery.js';

// Load environment variables
dotenv.config();

const app = express();

// MongoDB connection with proper serverless handling
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    isConnected = db.connections[0].readyState === 1;
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    // Don't exit in serverless - just log the error
    isConnected = false;
  }
};

// Initialize connection
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : ['http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware to ensure DB connection before handling requests  
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database middleware error:', err);
    res.status(500).json({
      success: false,
      message: 'Database connection error'
    });
  }
});

// Root route - API information
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SRIJON Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      business: '/api/business/*',
      upload: '/api/upload/*',
      profile: '/api/profile/*',
      gallery: '/api/gallery/*'
    },
    documentation: 'https://github.com/ashraful009/SRIJON'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessDataRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/gallery', galleryRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SRIJON API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

// Start server for local development (not in Vercel serverless environment)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
