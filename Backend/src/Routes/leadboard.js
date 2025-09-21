import express from 'express';
const router = express.Router();
import { getTopUsers } from '../controllers/leadboardController.js';

router.get('/', getTopUsers);

export default router;
