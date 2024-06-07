import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Get current user's profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
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
});

// Send friend request
export const sendFriendRequest = asyncHandler(async (req, res) => {
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
});

// Accept friend request
export const acceptFriendRequest = asyncHandler(async (req, res) => {
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
});

// Reject friend request
export const rejectFriendRequest = asyncHandler(async (req, res) => {
  const { requesterId } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requesterId);
  await user.save();

  res.json({ message: 'Friend request rejected' });
});
