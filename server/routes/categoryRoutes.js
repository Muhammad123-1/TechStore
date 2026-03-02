import express from 'express';
import {
    getCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOrAssistant } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin & Assistant routes
router.post('/', protect, adminOrAssistant, createCategory);
router.put('/:id', protect, adminOrAssistant, updateCategory);
router.delete('/:id', protect, adminOrAssistant, deleteCategory);

export default router;
