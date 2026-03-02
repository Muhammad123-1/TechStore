import express from 'express';
import {
    getBrands,
    getBrandBySlug,
    createBrand,
    updateBrand,
    deleteBrand
} from '../controllers/brandController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOrAssistant } from '../middleware/adminMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getBrands);
router.get('/:slug', getBrandBySlug);

// Admin & Assistant routes
router.post('/', protect, adminOrAssistant, upload.single('logo'), createBrand);
router.put('/:id', protect, adminOrAssistant, upload.single('logo'), updateBrand);
router.delete('/:id', protect, adminOrAssistant, deleteBrand);

export default router;
