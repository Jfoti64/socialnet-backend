// routes/postRoutes.js
import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import commentRoutes from './commentRoutes.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .post(auth, createPost) // Create a new post
  .get(auth, getPosts); // Get all posts

router
  .route('/:id')
  .get(auth, getPost) // Get a post by ID
  .put(auth, updatePost) // Update a post by ID
  .delete(auth, deletePost); // Delete a post by ID

// Nest comment routes under posts
router.use('/:postId/comments', commentRoutes); // Nested routes for comments

export default router;
