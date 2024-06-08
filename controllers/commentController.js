// controllers/commentController.js
import Comment from '../models/Comment.js';
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

    const comment = new Comment({
      content: req.body.content,
      author: req.user.id,
      post: req.params.postId,
    });

    await comment.save();

    res.status(201).json(comment);
  }),
];

// Get all comments for a post
export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId }).populate('author', 'name');
  res.json(comments);
});

// Update a comment
export const updateComment = [
  check('content', 'Content is required').not().isEmpty(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    comment.content = req.body.content;
    await comment.save();

    res.json(comment);
  }),
];

// Delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  if (comment.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'User not authorized' });
  }

  await comment.deleteOne();

  res.json({ message: 'Comment removed' });
});
