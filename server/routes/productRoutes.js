import express from 'express';
import {
    getProducts,
    getFeaturedProducts,
    getProduct,
    getRelatedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    applyBulkDiscount
} from '../controllers/productController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { adminOrAssistant } from '../middleware/adminMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

import reviewRouter from './reviewRoutes.js';

const router = express.Router();

// Re-route into other resource routers
router.use('/:productId/reviews', reviewRouter);

// Public routes
router.get('/featured', getFeaturedProducts);
router.route('/bulk-discount').post(protect, adminOrAssistant, applyBulkDiscount);
router.get('/', optionalAuth, getProducts);
router.get('/:slug', getProduct);
router.get('/:slug/related', getRelatedProducts);

// Admin & Assistant routes
router.post('/', protect, adminOrAssistant, upload.array('images'), createProduct);
router.put('/:id', protect, adminOrAssistant, upload.array('images'), updateProduct);
router.delete('/:id', protect, adminOrAssistant, deleteProduct);
router.route('/:id/images').post(protect, adminOrAssistant, upload.array('images'), uploadProductImages);

export default router;
