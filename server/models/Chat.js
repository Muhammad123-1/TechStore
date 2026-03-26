import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 2000
    },
    senderName: {
        type: String,
        default: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    guestId: {
        type: String,
        default: null
    },
    userName: {
        type: String,
        default: 'Guest'
    },
    userEmail: {
        type: String,
        default: null
    },
    type: {
        type: String,
        enum: ['support', 'sales'],
        default: 'support'
    },
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
    },
    messages: [messageSchema],
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    unreadCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient queries
chatSchema.index({ status: 1, lastMessageAt: -1 });
chatSchema.index({ user: 1 });
chatSchema.index({ guestId: 1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
