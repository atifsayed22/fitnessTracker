import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addLog, getLogs } from '../controllers/logController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/add', addLog);
router.get('/', getLogs);

export default router;