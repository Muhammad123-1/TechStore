import User from '../models/User.js';
import PendingUser from '../models/PendingUser.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, generateEmailToken, generateResetToken, verifyRefreshToken } from '../utils/tokenUtils.js';
import { sendVerificationEmail, sendPasswordResetEmail, sendSecurityAlertEmail } from '../utils/emailService.js';
import { generateOTP, sendEmailOTP, sendSMSOTP } from '../utils/otpUtils.js';
import { setTokenCookies, clearTokenCookies } from '../middleware/cookieMiddleware.js';
import crypto from 'crypto';
import IPBlock from '../models/IPBlock.js';
import { getLocalizedMessage } from '../utils/localizedMessages.js';

const handleFailedAttempt = async (ip, userEmail) => {
    let block = await IPBlock.findOne({ ipAddress: ip });
    if (!block) {
        block = await IPBlock.create({ ipAddress: ip, failures: 1 });
    } else {
        block.failures += 1;
        if (block.failures === 3) {
            block.lockUntil = new Date(Date.now() + 1 * 60000); // 1 min lock
        } else if (block.failures >= 5) {
            block.lockUntil = new Date(Date.now() + 15 * 60000); // 15 mins lock
        }
        await block.save();
    }

    if (userEmail) {
        const user = await User.findOne({ email: userEmail });
        if (user) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
            if (user.failedLoginAttempts >= 10) {
                user.accountLockedUntil = new Date(Date.now() + 24 * 60 * 60000); // 24 hours
                await user.save();
                sendSecurityAlertEmail(user.email, user.name, ip, user.language).catch(err => console.error("Failed to send security alert", err));
                return { isAccountLocked: true };
            }
            await user.save();
        }
    }
    return { failures: block.failures, lockUntil: block.lockUntil };
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Strict validation
        if (!name || name.trim().length < 3 || /^\d+$/.test(name.trim())) {
            return res.status(400).json({ success: false, message: 'Invalid name representation' });
        }
        if (!phone || !/^\+998\d{9}$/.test(phone)) {
            return res.status(400).json({ success: false, message: 'Phone number must be a valid Uzbekistan number (+998XXXXXXXXX)' });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const inputLang = (req.body.language || 'en').split('-')[0].toLowerCase();
        const validLang = ['en', 'ru', 'uz'].includes(inputLang) ? inputLang : 'en';
        const hashed = await bcrypt.hash(password, 10);
        const otp = generateOTP();

        // Zero Trust: Clean up any old pending registrations for this email before creating new one
        await PendingUser.deleteMany({ email });

        // Create a pending user (do not create real account until OTP verified)
        const pending = await PendingUser.create({
            name,
            email,
            password: hashed,
            phone,
            language: validLang,
            otpCode: otp,
            otpExpire: Date.now() + 10 * 60 * 1000 // 10 minutes
        });

        // Send OTP via Email and SMS (localized)
        try {
            await sendEmailOTP(email, name, otp, validLang);
            if (phone) {
                await sendSMSOTP(phone, otp, validLang);
            }
        } catch (error) {
            console.error('OTP sending failed:', error);
        }

        res.status(201).json({
            success: true,
            message: getLocalizedMessage('registration_start', validLang),
            data: {
                email: pending.email,
                name: pending.name
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        // Language setup
        const lang = req.headers['accept-language']?.split(',')[0].substring(0, 2) || 'uz';

        if (user && user.accountLockedUntil && user.accountLockedUntil > Date.now()) {
            return res.status(403).json({
                success: false,
                message: getLocalizedMessage('account_locked', lang)
            });
        }

        if (!user) {
            await handleFailedAttempt(clientIp, email);
            return res.status(401).json({
                success: false,
                message: getLocalizedMessage('invalid_credentials', lang)
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            const attemptStatus = await handleFailedAttempt(clientIp, email);
            if (attemptStatus && attemptStatus.isAccountLocked) {
                return res.status(403).json({
                    success: false,
                    message: getLocalizedMessage('account_locked_errors', lang)
                });
            }
            return res.status(401).json({
                success: false,
                message: getLocalizedMessage('invalid_credentials', lang)
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Reset strike counters on success
        await IPBlock.deleteOne({ ipAddress: clientIp });
        user.failedLoginAttempts = 0;
        user.accountLockedUntil = undefined;
        user.refreshToken = refreshToken;
        user.lastLogin = Date.now();
        await user.save();

        // Set tokens in cookies (httpOnly for security)
        setTokenCookies(res, accessToken, refreshToken);

        // Remove password from response
        user.password = undefined;

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Find user
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user._id);

        res.json({
            success: true,
            data: {
                accessToken
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token'
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    try {
        // Clear refresh token
        req.user.refreshToken = null;
        await req.user.save();

        // Clear cookies (httpOnly tokens)
        clearTokenCookies(res);

        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ emailVerificationToken: token });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with this email'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        user.resetPasswordToken = otp; // store OTP here cleanly
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        // Send OTP via Email and SMS
        try {
            const lang = user.language || req.body.language || 'en';
            await sendEmailOTP(email, user.name, otp, lang);
            if (user.phone) {
                await sendSMSOTP(user.phone, otp, lang);
            }

            res.json({
                success: true,
                message: getLocalizedMessage('password_reset_otp', lang)
            });
        } catch (emailError) {
            console.error('❌ Failed to send password reset OTP:', emailError && (emailError.message || emailError));
            // Don't expose internal error details to the client
            return res.status(503).json({
                success: false,
                message: 'Service unavailable. Please try again later.'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        const user = await User.findOne({
            email: email,
            resetPasswordToken: otp,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Send/Resend OTP
// @route   POST /api/auth/send-otp
// @access  Private
export const sendOTP = async (req, res) => {
    try {
        // Support both authenticated and unauthenticated resend flows
        let user;
        if (req.user && req.user._id) {
            user = await User.findById(req.user._id);
        } else if (req.body && req.body.email) {
            // Prefer pending user for resend during registration
            user = await PendingUser.findOne({ email: req.body.email }) || await User.findOne({ email: req.body.email });
        } else {
            return res.status(400).json({ success: false, message: 'Email is required to resend OTP' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otp = generateOTP();
        user.otpCode = otp;
        user.otpExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        try {
            const lang = user.language || 'en';
            await sendEmailOTP(user.email, user.name || user.email, otp, lang);
            if (user.phone) {
                await sendSMSOTP(user.phone, otp, lang);
            }

            return res.json({
                success: true,
                message: getLocalizedMessage('otp_resent', lang)
            });
        } catch (emailError) {
            console.error('❌ Failed to send OTP:', emailError.message || emailError);
            // Do not expose internal error details to client
            return res.status(503).json({ success: false, message: 'Email service unavailable. Please try again later.' });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Private
export const verifyOTP = async (req, res) => {
    try {
        // Support both authenticated and unauthenticated verification flows
        const { email } = req.body;
        const code = req.body.code?.toString().trim();

        // Support verification for PendingUser (registration flow) or existing User
        let user = null;
        let isPending = false;

        if (req.user && req.user._id) {
            user = await User.findById(req.user._id);
        } else if (email) {
            const pending = await PendingUser.findOne({ email });
            if (pending) {
                user = pending;
                isPending = true;
            } else {
                user = await User.findOne({ email });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Email or authentication required' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Language setup for localized error messages
        const lang = user.language || req.headers['accept-language']?.split(',')[0].substring(0, 2) || 'uz';

        if (!user.otpCode || user.otpCode !== code) {
            return res.status(400).json({ success: false, message: getLocalizedMessage('otp_invalid', lang) });
        }

        if (user.otpExpire < Date.now()) {
            return res.status(400).json({ success: false, message: getLocalizedMessage('otp_expired', lang) });
        }

        if (isPending) {
            // Create real user from pending
            const newUser = await User.create({
                name: user.name,
                email: user.email,
                password: user.password,
                phone: user.phone,
                language: user.language
            });

            // Remove pending entry
            await PendingUser.deleteOne({ _id: user._id });

            // Prepare tokens
            const accessToken = generateAccessToken(newUser._id);
            const refreshToken = generateRefreshToken(newUser._id);
            newUser.refreshToken = refreshToken;
            newUser.isEmailVerified = true;
            if (newUser.phone) newUser.isPhoneVerified = true;
            await newUser.save();

            // Set cookies
            setTokenCookies(res, accessToken, refreshToken);

            return res.json({
                success: true,
                message: getLocalizedMessage('account_verified', lang),
                data: { user: newUser, accessToken, refreshToken }
            });
        }

        // Existing user verification
        user.isEmailVerified = true;
        if (user.phone) user.isPhoneVerified = true;
        user.otpCode = undefined;
        user.otpExpire = undefined;

        // Generate auth tokens now that user is verified
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;

        await user.save();

        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);

        res.json({
            success: true,
            message: getLocalizedMessage('account_verified', lang),
            data: { user, accessToken, refreshToken }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
