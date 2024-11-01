import mongoose from 'mongoose';
import 'dotenv/config'


const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if the connection fails
  }
};
