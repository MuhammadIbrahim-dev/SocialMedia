import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import AuthRouter from "./src/Routes/Auth.Route.js";
import { Connection } from "./src/libs/db.js";
import UserRouter from "./src/Routes/userRoute.js";
import PostRouter from "./src/Routes/PostRoute.js";
import CommentRouter from "./src/Routes/CommentRoute.js";
import LeaderboardRouter from "./src/Routes/leadboard.js";
import ContentRouter from "./src/Routes/contentRoute.js";

const app = express();

// Whitelist of allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://social-media-ruby-seven.vercel.app",
];

// ✅ CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/posts", PostRouter);
app.use("/api/comments", CommentRouter);
app.use("/api/leaderboard", LeaderboardRouter);
app.use("/api/content", ContentRouter);

app.get("/", (req, res) => res.send("Community AI Forum backend is running"));

// ✅ Database connection
Connection()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

// ✅ Export app for Vercel
export default app;

// ✅ Only run app.listen() locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 8000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running locally at http://localhost:${port}`);
  });
}
