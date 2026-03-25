import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true, default: 'Uzbekistan' },
    zipCode: { type: String },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\+998\d{9}$/, 'Please enter a valid Uzbekistan phone number (+998XXXXXXXXX)']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        validate: {
            validator: function (v) {
                // If it's already a bcrypt hash, don't re-validate complexity
                if (v && (v.startsWith('$2a$') || v.startsWith('$2b$'))) return true;

                // Minimum 8 chars, at least one uppercase, one lowercase, one number and one special character
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/.test(v);
            },
            message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).'
        },
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'delivery', 'assistant', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: null
    },
    addresses: [addressSchema],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    // Preferred language for communications (en, ru, uz)
    language: {
        type: String,
        enum: ['en', 'ru', 'uz'],
        default: 'en'
    },
    otpCode: String,
    otpExpire: Date,
    emailVerificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: String,
    lastLogin: Date,
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    accountLockedUntil: Date
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    delete user.otpCode;
    delete user.otpExpire;
    delete user.emailVerificationToken;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpire;
    delete user.failedLoginAttempts;
    delete user.accountLockedUntil;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
