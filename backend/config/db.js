import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Ensure dotenv is configured
dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error(
        'MongoDB URI is not defined. Please check your environment variables.'
      );
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
