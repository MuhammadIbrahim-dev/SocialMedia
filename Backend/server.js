
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'  
import  AuthRouter from './src/Routes/Auth.Route.js'
import { Connection } from './src/libs/db.js'
const app = express()

const port = process.env.PORT || 8000

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());
dotenv.config()
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


app.use('/api/auth',AuthRouter)

const startServer = async () => {
  try {
    await Connection(); // connect to DB first
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
  }
};

startServer();
