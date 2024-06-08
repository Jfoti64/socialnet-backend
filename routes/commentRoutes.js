// routes/commentRoutes.js
import express from 'express';
import {
  addComment,
  updateComment,
  deleteComment,
  getComments,
} from '../controllers/commentController.js';
import auth from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(auth, addComment) // Add a comment to a post
  .get(auth, getComments); // Get all comments for a post

router
  .route('/:commentId')
  .put(auth, updateComment) // Update a comment
  .delete(auth, deleteComment); // Delete a comment

export default router;
