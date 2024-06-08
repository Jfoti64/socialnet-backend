// controllers/commentController.js
import Post from '../models/Post.js';
import asyncHandler from 'express-async-handler';
import { check, validationResult } from 'express-validator';

// Add a comment to a post
export const addComment = [
  check('content', 'Content is required').not().isEmpty(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      content: req.body.content,
      author: req.user.id,
    };

    post.comments.push(comment);
    await post.save();

    const addedComment = post.comments[post.comments.length - 1];
    res.status(201).json(addedComment);
  }),
];

// Get all comments
export const getComments = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId).populate('comments.author', 'name');
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post.comments);
});

// Update a comment
export const updateComment = [
  check('content', 'Content is required').not().isEmpty(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    comment.content = req.body.content;
    await post.save();

    res.json(comment);
  }),
];

// Delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const comment = post.comments.id(req.params.commentId);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  if (comment.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'User not authorized' });
  }

  comment.remove();
  await post.save();

  res.json({ message: 'Comment removed' });
});
