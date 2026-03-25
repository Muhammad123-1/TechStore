import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 10000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/techstore',
    jwtSecret: (process.env.JWT_SECRET || 'your_jwt_secret_key').trim(),
    jwtRefreshSecret: (process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret').trim(),
    jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE || '15m',
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
    clientUrl: (process.env.CLIENT_URL || 'http://localhost:5173').trim(),
    smtp: {
        host: (process.env.SMTP_HOST || '').trim(),
        port: process.env.SMTP_PORT,
        user: (process.env.SMTP_USER || '').trim(),
        pass: (process.env.SMTP_PASS || '').trim(),
        from: (process.env.EMAIL_FROM || 'TechStore <support@techstore.uz>').trim()
    },
    sendgrid: {
        apiKey: (process.env.SENDGRID_API_KEY || '').trim()
    },
    twilio: {
        sid: (process.env.TWILIO_ACCOUNT_SID || '').trim(),
        token: (process.env.TWILIO_AUTH_TOKEN || '').trim(),
        from: (process.env.TWILIO_FROM || '').trim()
    },
    stripe: {
        secretKey: (process.env.STRIPE_SECRET_KEY || '').trim()
    },
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
        allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    },
    payme: {
        merchantId: (process.env.PAYME_MERCHANT_ID || '').trim(),
        secretKey: (process.env.PAYME_SECRET_KEY || '').trim()
    },
    click: {
        merchantId: (process.env.CLICK_MERCHANT_ID || '').trim(),
        serviceId: (process.env.CLICK_SERVICE_ID || '').trim(),
        secretKey: (process.env.CLICK_SECRET_KEY || '').trim()
    }
};
