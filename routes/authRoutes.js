// routes/auth.js
import express from 'express';
import passport from 'passport';
import asyncHandler from 'express-async-handler';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Register new user
router.post('/register', asyncHandler(authController.register));

// Login user
router.post('/login', authController.login);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  authController.googleCallback
);

router.get('/success', authController.success);

export default router;
