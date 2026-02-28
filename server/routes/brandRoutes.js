import express from 'express';
import {
    getBrands,
    getBrandBySlug,
    createBrand,
    updateBrand,
    deleteBrand
} from '../controllers/brandController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getBrands);
router.get('/:slug', getBrandBySlug);

// Admin routes
router.post('/', protect, admin, upload.single('logo'), createBrand);
router.put('/:id', protect, admin, upload.single('logo'), updateBrand);
router.delete('/:id', protect, admin, deleteBrand);

export default router;
