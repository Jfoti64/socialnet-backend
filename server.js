import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import RateLimit from 'express-rate-limit';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Import configurations and routes after dotenv.config()
import './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

const app = express();

// Trust the first proxy
app.set('trust proxy', 1);

// Rate limiter: maximum of 30 requests per minute
if (process.env.NODE_ENV !== 'test') {
  const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30,
  });
  app.use(limiter);
}

app.use(compression());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

// Helmet configuration
app.use(helmet());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to SocialNet API');
});

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));
}

// Error handling middleware should be the last middleware
app.use(errorHandler);

export default app;
