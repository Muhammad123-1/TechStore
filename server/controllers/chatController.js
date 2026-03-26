import Chat from '../models/Chat.js';

// @desc    Create or resume a chat session
// @route   POST /api/chats
// @access  Public (with optional auth)
export const createOrResumeChat = async (req, res) => {
    try {
        const { type = 'support', guestId } = req.body;

        // If user is authenticated, find their existing active chat
        if (req.user) {
            let chat = await Chat.findOne({
                user: req.user._id,
                type,
                status: 'active'
            }).sort('-lastMessageAt');

            if (!chat) {
                chat = await Chat.create({
                    user: req.user._id,
                    userName: req.user.name,
                    userEmail: req.user.email,
                    type,
                    messages: []
                });
            }

            return res.json({ success: true, data: chat });
        }

        // Guest user — use guestId to find/create
        if (!guestId) {
            return res.status(400).json({ success: false, message: 'guestId is required for unauthenticated users' });
        }

        let chat = await Chat.findOne({ guestId, type, status: 'active' }).sort('-lastMessageAt');

        if (!chat) {
            chat = await Chat.create({
                guestId,
                userName: req.body.userName || 'Guest',
                userEmail: req.body.userEmail || null,
                type,
                messages: []
            });
        }

        return res.json({ success: true, data: chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all chats (Admin)
// @route   GET /api/chats
// @access  Private/Admin
export const getAllChats = async (req, res) => {
    try {
        const { status = 'active', type } = req.query;
        const query = { status };
        if (type) query.type = type;

        const chats = await Chat.find(query)
            .populate('user', 'name email avatar')
            .sort('-lastMessageAt');

        res.json({ success: true, count: chats.length, data: chats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get a single chat by ID
// @route   GET /api/chats/:id
// @access  Private (admin or owner)
export const getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id).populate('user', 'name email avatar');

        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        const isAdmin = ['admin', 'assistant'].includes(req.user?.role);
        const isOwner = chat.user && chat.user._id.toString() === req.user?._id?.toString();
        const isGuest = chat.guestId && req.body.guestId === chat.guestId;

        if (!isAdmin && !isOwner && !isGuest) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Reset unread count when admin views
        if (isAdmin && chat.unreadCount > 0) {
            chat.unreadCount = 0;
            await chat.save();
        }

        res.json({ success: true, data: chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Send a message in a chat
// @route   POST /api/chats/:id/messages
// @access  Public (with optional auth)
export const sendMessage = async (req, res) => {
    try {
        const { text, guestId } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: 'Message text is required' });
        }

        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        const isAdmin = ['admin', 'assistant'].includes(req.user?.role);
        const isOwner = chat.user && chat.user.toString() === req.user?._id?.toString();
        const isGuestOwner = chat.guestId && guestId === chat.guestId;

        if (!isAdmin && !isOwner && !isGuestOwner) {
            return res.status(403).json({ success: false, message: 'Not authorized to send messages in this chat' });
        }

        const sender = isAdmin ? 'admin' : 'user';
        const senderName = isAdmin
            ? (req.user.name || 'Admin')
            : (req.user?.name || chat.userName || 'Guest');

        chat.messages.push({ sender, text: text.trim(), senderName });
        chat.lastMessageAt = new Date();

        // Increment unread count for admin if user sends
        if (sender === 'user') {
            chat.unreadCount = (chat.unreadCount || 0) + 1;
        }

        await chat.save();

        res.json({ success: true, data: chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Close a chat session
// @route   PUT /api/chats/:id/close
// @access  Private/Admin
export const closeChat = async (req, res) => {
    try {
        const chat = await Chat.findByIdAndUpdate(
            req.params.id,
            { status: 'closed' },
            { new: true }
        );

        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        res.json({ success: true, message: 'Chat closed', data: chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
