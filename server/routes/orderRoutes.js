import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOrAssistant, adminAssistantOrDelivery } from '../middleware/adminMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/:id/cancel', protect, cancelOrder);

// Admin & Staff routes
router.get('/all/list', protect, adminAssistantOrDelivery, getAllOrders);
router.put('/:id/status', protect, adminAssistantOrDelivery, updateOrderStatus);

export default router;
