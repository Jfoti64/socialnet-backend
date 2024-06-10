import express from 'express';
import {
  getCurrentUserProfile,
  getUserProfile,
  updateProfile,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  searchUsers,
  getUserPosts,
  getUserFriends,
  getUserComments,
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

router.get('/friend-requests', auth, getFriendRequests); // Get incoming friend requests

router.get('/search', auth, searchUsers); // Search users

// Routes to get user's posts, friends, and comments
router.get('/profile/:userId/posts', auth, getUserPosts); // Get user's posts
router.get('/profile/:userId/friends', auth, getUserFriends); // Get user's friends
router.get('/profile/:userId/comments', auth, getUserComments); // Get user's comments

export default router;
