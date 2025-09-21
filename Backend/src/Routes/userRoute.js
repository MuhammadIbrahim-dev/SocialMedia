import express from 'express';
const router = express.Router();
import { AuthMiddleware as auth } from '../middlerwares/authMiddleware.js';
import { getProfile, updateProfile } from '../controllers/userCotroller.js';

router.get('/:id', getProfile); // public profile view
router.put('/me', auth, updateProfile); // update own profile

export default router;
