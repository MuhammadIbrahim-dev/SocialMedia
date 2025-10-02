

import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'  
import  AuthRouter from './src/Routes/Auth.Route.js'   
import { Connection } from './src/libs/db.js'
import UserRouter from './src/Routes/userRoute.js';
import PostRouter from './src/Routes/PostRoute.js';
import CommentRouter from './src/Routes/CommentRoute.js';
import LeaderboardRouter from './src/Routes/leadboard.js';
import ContentRouter from './src/Routes/contentRoute.js';
const app = express()

const port = process.env.PORT || 8000

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://mediabackend.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/posts", PostRouter);
app.use("/api/comments", CommentRouter);
app.use("/api/leaderboard", LeaderboardRouter);
app.use("/api/content", ContentRouter);

// Handle favicon requests from browsers
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());

app.get("/", (req, res) => res.send("Community AI Forum backend is running"));

// ✅ Database connection
await Connection().catch(err => {
  console.error("Failed to connect to the database", err);
  process.exit(1);
});

// ✅ Export app for Vercel
export default app;

// ✅ Only run app.listen() when not in a serverless environment (like Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`🚀 Server running locally at http://localhost:${port}`);
  });
}
