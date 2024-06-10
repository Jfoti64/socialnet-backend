// routes/postRoutes.js
import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getFeedPosts,
  toggleLike,
} from '../controllers/postController.js';
import auth from '../middleware/auth.js';
import commentRoutes from './commentRoutes.js';

const router = express.Router();

router.route('/feed').get(auth, getFeedPosts);

router
  .route('/')
  .post(auth, createPost) // Create a new post
  .get(auth, getPosts); // Get all posts

router
  .route('/:id')
  .get(auth, getPost) // Get a post by ID
  .put(auth, updatePost) // Update a post by ID
  .delete(auth, deletePost); // Delete a post by ID

router.route('/:id/toggle-like').post(auth, toggleLike); // Toggle like on a post

// Nest comment routes under posts
router.use('/:postId/comments', commentRoutes);

export default router;
