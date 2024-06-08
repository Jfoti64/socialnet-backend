import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config(); // Ensure this is at the very top

import './config/passport.js'; // Ensure this is imported after dotenv.config()
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
app.use(cors());

// Helmet configuration
app.use(helmet());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Ensure cookies are secure in production
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

export default app;
