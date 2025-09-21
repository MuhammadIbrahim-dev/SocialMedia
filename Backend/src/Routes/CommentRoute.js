import express from 'express';
const router = express.Router();
import { AuthMiddleware as auth } from '../middlerwares/authMiddleware.js';
import { createComment, getCommentsForPost, updateComment, deleteComment, voteComment } from '../controllers/commentConroller.js';

router.get('/post/:postId', getCommentsForPost);
router.post('/post/:postId', auth, createComment);

router.put('/:id', auth, updateComment);
router.delete('/:id', auth, deleteComment);

router.post('/:id/vote', auth, voteComment);

export default router;
