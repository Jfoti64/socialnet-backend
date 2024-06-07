// controllers/userController.js
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import { check, validationResult } from 'express-validator';

// Get current user's profile
export const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// Get another user's profile by ID
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// Update user profile
export const updateProfile = [
  // Validation rules
  check('name', 'Name is required').optional().not().isEmpty(),
  check('email', 'Please include a valid email').optional().isEmail(),
  check('password', 'Password must be at least 6 characters').optional().isLength({ min: 6 }),

  // Controller logic
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();
    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
    });
  }),
];

// Send friend request
export const sendFriendRequest = [
  // Validation rules
  check('recipientId', 'Recipient ID is required').not().isEmpty(),

  // Controller logic
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const recipient = await User.findById(req.body.recipientId);

    if (!recipient) {
      res.status(404);
      throw new Error('User not found');
    }

    if (recipient.friendRequests.includes(req.user.id)) {
      res.status(400);
      throw new Error('Friend request already sent');
    }

    recipient.friendRequests.push(req.user.id);
    await recipient.save();

    res.json({ message: 'Friend request sent' });
  }),
];

// Accept friend request
export const acceptFriendRequest = [
  // Validation rules
  check('requesterId', 'Requester ID is required').not().isEmpty(),

  // Controller logic
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { requesterId } = req.body;
    const user = await User.findById(req.user.id);
    const requester = await User.findById(requesterId);

    if (!requester) {
      res.status(404);
      throw new Error('User not found');
    }

    user.friends.push(requesterId);
    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requesterId);
    requester.friends.push(req.user.id);

    await user.save();
    await requester.save();

    res.json({ message: 'Friend request accepted' });
  }),
];

// Reject friend request
export const rejectFriendRequest = [
  // Validation rules
  check('requesterId', 'Requester ID is required').not().isEmpty(),

  // Controller logic
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { requesterId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requesterId);
    await user.save();

    res.json({ message: 'Friend request rejected' });
  }),
];
