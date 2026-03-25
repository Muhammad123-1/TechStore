import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true }, // hashed
    language: { type: String, enum: ['en', 'ru', 'uz'], default: 'en' },
    otpCode: String,
    otpExpire: Date
}, { timestamps: true });

const PendingUser = mongoose.model('PendingUser', pendingUserSchema);

export default PendingUser;
