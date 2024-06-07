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

router.route('/friend-request').post(auth, sendFriendRequest); // Send a friend request

router.route('/accept-friend-request').post(auth, acceptFriendRequest); // Accept a friend request

router.route('/reject-friend-request').post(auth, rejectFriendRequest); // Reject a friend request

export default router;
