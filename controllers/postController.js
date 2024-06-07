import Post from '../models/Post.js';
import asyncHandler from 'express-async-handler';

// Create a new post
export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const newPost = new Post({
    content,
    author: req.user.id,
  });
  const savedPost = await newPost.save();
  res.status(201).json(savedPost);
});

// Get all posts
export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate('author', 'name profilePicture').sort({ createdAt: -1 });
  res.json(posts);
});

// Get a single post
export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name profilePicture');
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }
  res.json(post);
});

// Update a post
export const updatePost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }
  if (post.author.toString() !== req.user.id) {
    res.status(403).json({ message: 'User not authorized' });
    return;
  }
  post.content = content;
  const updatedPost = await post.save();
  res.json(updatedPost);
});

// Delete a post
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }
  if (post.author.toString() !== req.user.id) {
    res.status(403).json({ message: 'User not authorized' });
    return;
  }
  await post.remove();
  res.json({ message: 'Post removed' });
});
