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

router.route('/me').get(auth, getProfile).put(auth, updateProfile);
router.post('/friend-request', auth, sendFriendRequest);
router.post('/accept-friend-request', auth, acceptFriendRequest);
router.post('/reject-friend-request', auth, rejectFriendRequest);

export default router;
