
import mongoose from 'mongoose';

let isConnected = false;

export const Connection = async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log('Database connected successfully');
  } catch (error) {
    // Log the full error for better debugging, and re-throw it.
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};
