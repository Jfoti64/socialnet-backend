import express from 'express';
import passport from 'passport';
import asyncHandler from 'express-async-handler';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register); // Register new user
router.post('/login', asyncHandler(authController.login)); // Login user

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  authController.googleCallback
);

router.get('/success', authController.success); // Success route

export default router;
