import express from 'express';
const router = express.Router();
import { AuthMiddleware as auth } from '../middlerwares/authMiddleware.js';
import {
  createPost,
  getPosts,
  getPost,
  getPostsByUser,
  updatePost,
  deletePost,
  vote,
} from '../controllers/PostController.js';

// -------------------- Public --------------------
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/user/:userId', getPostsByUser);

// -------------------- Protected --------------------
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/vote', auth, vote);

export default router;
