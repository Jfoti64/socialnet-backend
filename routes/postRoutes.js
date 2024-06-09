// routes/postRoutes.js
import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getFeedPosts,
} from '../controllers/postController.js';
import auth from '../middleware/auth.js';

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

export default router;
