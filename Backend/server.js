
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'  
import  AuthRouter from './src/Routes/Auth.Route.js'   
import { Connection } from './src/libs/db.js'
import UserRouter from './src/Routes/userRoute.js';
import PostRouter from './src/Routes/PostRoute.js';
import CommentRouter from './src/Routes/CommentRoute.js';
import LeaderboardRouter from './src/Routes/leadboard.js';
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
app.use('/api/users', UserRouter);
app.use('/api/posts', PostRouter);
app.use('/api/comments', CommentRouter);
app.use('/api/leaderboard', LeaderboardRouter);
app.get('/', (req, res) => res.send('Community AI Forum backend is running'));

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
