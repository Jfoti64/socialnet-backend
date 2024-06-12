import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import { check, validationResult } from 'express-validator';
import FriendRequest from '../models/FriendRequest.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

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
  check('firstName', 'First name is required').optional().not().isEmpty(),
  check('lastName', 'Last name is required').optional().not().isEmpty(),
  check('email', 'Please include a valid email').optional().isEmail(),
  check('password', 'Password must be at least 6 characters').optional().isLength({ min: 6 }),

  // Controller logic
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();
    res.json({
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
    });
  }),
];

// Send friend request
export const sendFriendRequest = [
  check('recipientId', 'Recipient ID is required').not().isEmpty(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const recipient = await User.findById(req.body.recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    const requester = await User.findById(req.user.id);

    // Check if they are already friends
    if (requester.friends.includes(recipient._id)) {
      return res.status(400).json({ message: 'You are already friends with this user' });
    }

    const existingRequest = await FriendRequest.findOne({
      requester: req.user.id,
      recipient: req.body.recipientId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    const friendRequest = new FriendRequest({
      requester: req.user.id,
      recipient: req.body.recipientId,
    });

    await friendRequest.save();

    // Update the recipient's friendRequests array
    recipient.friendRequests.push(req.user.id);
    await recipient.save();

    res.json({ message: 'Friend request sent' });
  }),
];

// Accept friend request
export const acceptFriendRequest = [
  check('requesterId', 'Requester ID is required').not().isEmpty(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { requesterId } = req.body;
    const user = await User.findById(req.user.id);
    const requester = await User.findById(requesterId);

    if (!requester) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.friends.push(requesterId);
    requester.friends.push(req.user.id);

    // Remove the requester's ID from the recipient's friendRequests array
    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requesterId);

    await user.save();
    await requester.save();

    await FriendRequest.findOneAndDelete({ requester: requesterId, recipient: req.user.id });

    res.json({ message: 'Friend request accepted' });
  }),
];

// Reject friend request
export const rejectFriendRequest = [
  check('requesterId', 'Requester ID is required').not().isEmpty(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { requesterId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await FriendRequest.findOneAndDelete({ requester: requesterId, recipient: req.user.id });

    // Remove the requester's ID from the recipient's friendRequests array
    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requesterId);

    await user.save();

    res.json({ message: 'Friend request rejected' });
  }),
];

// Get incoming friend requests
export const getFriendRequests = asyncHandler(async (req, res) => {
  const friendRequests = await FriendRequest.find({
    recipient: req.user.id,
  }).populate('requester', 'firstName lastName profilePicture');

  res.json(friendRequests);
});

// Search users by name or email
export const searchUsers = asyncHandler(async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive search
  const users = await User.find({
    $or: [{ firstName: searchRegex }, { lastName: searchRegex }, { email: searchRegex }],
  }).select('firstName lastName email profilePicture');

  res.json(users);
});

// Get a user's posts
export const getUserPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.params.userId });
  res.json(posts);
});

// Get a user's friends
export const getUserFriends = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).populate(
    'friends',
    'firstName lastName profilePicture'
  );
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user.friends);
});

// Get a user's comments
export const getUserComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ author: req.params.userId }).populate(
    'author',
    'firstName lastName profilePicture'
  );
  res.json(comments);
});
