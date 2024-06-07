import express from 'express';
import {
  addComment,
  updateComment,
  deleteComment,
  getComments,
} from '../controllers/commentController.js';
import auth from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.route('/').post(auth, addComment).get(auth, getComments); // Add and get comments for a post

router
  .route('/:commentId')
  .put(auth, updateComment) // Update a comment
  .delete(auth, deleteComment); // Delete a comment

export default router;
