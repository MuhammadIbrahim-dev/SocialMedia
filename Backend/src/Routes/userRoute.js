import express from 'express';
const router = express.Router();
import { AuthMiddleware as auth } from '../middlerwares/authMiddleware.js';
import { getProfile, updateProfile, updateProfileWithAvatar } from '../controllers/userCotroller.js';
import upload, { handleUploadError } from '../middleware/upload.js';

// Public profile view
router.get('/:id', getProfile);

// Update profile without avatar
router.put('/me', auth, updateProfile);

// Update profile with avatar upload
router.put('/me/avatar', auth, upload.single('avatar'), handleUploadError, updateProfileWithAvatar);

export default router;
