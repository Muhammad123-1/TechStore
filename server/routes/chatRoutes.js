import express from 'express';
import {
    createOrResumeChat,
    getAllChats,
    getChatById,
    sendMessage,
    closeChat
} from '../controllers/chatController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (with optional auth for user identification)
router.post('/', optionalAuth, createOrResumeChat);
router.post('/:id/messages', optionalAuth, sendMessage);
router.get('/:id', optionalAuth, getChatById);

// Admin-only routes
router.get('/', protect, getAllChats);
router.put('/:id/close', protect, closeChat);

export default router;
