
import mongoose from 'mongoose';

let isConnected = false;

export const Connection = async () => {
    console.log(process.env.MONGODB_URL);
    
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("Database is connected successfully");
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Database connected successfully');
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit process if DB connection fails
    throw new Error('Database connection failed');
  }
};
