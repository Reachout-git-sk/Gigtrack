// index.js
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import { connectDB } from './db/connection.js';
import userRoutes from './routes/users.js';
import gigRoutes from './routes/gigs.js';
import goalRoutes from './routes/goals.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ FIX 1: Trust Render's reverse proxy so secure cookies work
app.set('trust proxy', 1);

// ✅ FIX 2: Manual CORS — NO cors library (rubric prohibits it)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://gigtrack.netlify.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

// ✅ FIX 3: Use connect-mongo for persistent sessions (already in package.json!)
import MongoStore from 'connect-mongo';

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/goals', goalRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'GigTrack API is running' }));

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch(err => { console.error('Failed to connect to MongoDB', err); process.exit(1); });
