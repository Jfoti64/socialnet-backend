import express from 'express';
import {
  getProfile,
  updateProfile,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router
  .route('/me')
  .get(auth, getProfile) // Get current user's profile
  .put(auth, updateProfile); // Update current user's profile

router
  .post('/friend-request', auth, sendFriendRequest) // Send a friend request
  .post('/accept-friend-request', auth, acceptFriendRequest) // Accept a friend request
  .post('/reject-friend-request', auth, rejectFriendRequest); // Reject a friend request

export default router;
