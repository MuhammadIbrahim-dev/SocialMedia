import mongoose from "mongoose";

export const Connection = async () => {
    console.log(process.env.MONGODB_URL);
    
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("Database is connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};
