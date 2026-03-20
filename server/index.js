import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import MongoStore from "connect-mongo";
import { connectDB } from "./db/connection.js";
import userRoutes from "./routes/users.js";
import gigRoutes from "./routes/gigs.js";
import goalRoutes from "./routes/goals.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1); // Required for Render — sits behind a proxy

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api/auth", userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/goals", goalRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "GigTrack API is running" });
});

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
  });
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
