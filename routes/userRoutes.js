// routes/userRoutes.js
import express from 'express';
import {
  getCurrentUserProfile,
  getUserProfile,
  updateProfile,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router
  .route('/me')
  .get(auth, getCurrentUserProfile) // Get current user's profile
  .put(auth, updateProfile); // Update current user's profile

router.get('/profile/:userId', auth, getUserProfile); // Get another user's profile by ID

router.post('/friend-request', auth, sendFriendRequest); // Send a friend request

router.post('/accept-friend-request', auth, acceptFriendRequest); // Accept a friend request

router.post('/reject-friend-request', auth, rejectFriendRequest); // Reject a friend request

export default router;
