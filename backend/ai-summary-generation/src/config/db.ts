import mongoose from 'mongoose';
import 'dotenv/config';

const config = {
  MONGODB_URI: process.env.MONGODB_URI || '',
  PORT: process.env.PORT || 5000,
};

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
