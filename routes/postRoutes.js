import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/postsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(auth, createPost).get(getPosts);
router.route('/:id').get(getPost).put(auth, updatePost).delete(auth, deletePost);

export default router;
