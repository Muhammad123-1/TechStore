import express from 'express';
import { getDashboardStats, getSalesData } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin, adminOrAssistant } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, adminOrAssistant, getDashboardStats);
router.get('/sales', protect, adminOrAssistant, getSalesData);

export default router;
