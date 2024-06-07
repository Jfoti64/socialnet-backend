import express from 'express';
import passport from 'passport';
import asyncHandler from 'express-async-handler';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router
  .post('/register', asyncHandler(authController.register)) // Register new user
  .post('/login', authController.login); // Login user

router.route('/google').get(passport.authenticate('google', { scope: ['profile', 'email'] })); // Google OAuth

router
  .route('/google/callback')
  .get(
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    authController.googleCallback
  ); // Google OAuth callback

router.route('/success').get(authController.success); // Success route

export default router;
