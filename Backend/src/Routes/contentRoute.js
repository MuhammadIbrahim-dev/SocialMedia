import express from 'express';
const router = express.Router();
import { AuthMiddleware as auth } from '../middlerwares/authMiddleware.js';
import { generateContent, generateSuggestions } from '../controllers/contentController.js';

// Content generation routes (protected)
router.post('/generate', auth, generateContent);
router.post('/suggestions', auth, generateSuggestions);

export default router;
