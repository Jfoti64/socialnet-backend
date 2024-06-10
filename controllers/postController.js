// src/controllers/postController.js
import Post from '../models/Post.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import { check, validationResult } from 'express-validator';

// Create a new post
export const createPost = [
  // Validation rules
  check('content', 'Content is required').not().isEmpty(),
  check('content', 'Content must be between 1 and 2000 characters').isLength({ min: 1, max: 2000 }),

  // Controller logic
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;
    const newPost = new Post({
      content,
      author: req.user.id,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  }),
];

// Get all posts
export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate('author', 'firstName lastName profilePicture')
    .sort({ createdAt: -1 });
  res.json(posts);
});

// Get all posts by self or friends
export const getFeedPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Find the user and populate their friends list
  const user = await User.findById(userId).populate('friends', '_id');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Collect the IDs of the user and their friends
  const friendsIds = user.friends.map((friend) => friend._id);
  friendsIds.push(userId);

  // Find posts authored by the user or their friends
  const posts = await Post.find({ author: { $in: friendsIds } })
    .populate('author', 'firstName lastName profilePicture')
    .sort({ createdAt: -1 });

  // Add a field to each post to indicate if the current user liked it
  const postsWithLikeStatus = posts.map((post) => ({
    ...post.toObject(),
    isLiked: post.likes.includes(userId),
  }));

  res.json(postsWithLikeStatus);
});

// Get a single post
export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    'author',
    'firstName lastName profilePicture'
  );
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
});

// Update a post
export const updatePost = [
  // Validation rules
  check('content', 'Content is required').not().isEmpty(),
  check('content', 'Content must be between 1 and 2000 characters').isLength({ min: 1, max: 2000 }),

  // Controller logic
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    post.content = content;
    const updatedPost = await post.save();
    res.json(updatedPost);
  }),
];

// Delete a post
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  if (post.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'User not authorized' });
  }
  await Post.deleteOne({ _id: req.params.id });
  res.json({ message: 'Post removed' });
});

// Add or remove a like from a post
export const toggleLike = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Check if the user has already liked the post
  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    // Remove the like
    post.likes = post.likes.filter((like) => like.toString() !== userId);
  } else {
    // Add the like
    post.likes.push(userId);
  }

  await post.save();

  res.status(200).json(post);
});
