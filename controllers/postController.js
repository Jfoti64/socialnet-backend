import Post from '../models/Post.js';
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
  const posts = await Post.find().populate('author', 'name profilePicture').sort({ createdAt: -1 });
  res.json(posts);
});

// Get a single post
export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name profilePicture');
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
