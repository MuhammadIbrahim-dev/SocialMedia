import express from 'express';
const router = express.Router();
import { AuthMiddleware as auth } from '../middlerwares/authMiddleware.js';
import { createPost, getPosts, getPost, vote, } from '../controllers/PostController.js';

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', auth, createPost);
router.post('/:id/vote', auth, vote);

// router.delete('/:id', auth, deletePost); // deletePost not exported, so commented out

export default router;
