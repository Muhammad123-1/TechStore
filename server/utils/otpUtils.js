import { sendMailGeneric, smtpAvailable } from './emailService.js';
import config from '../config/config.js';
import Twilio from 'twilio';

/**
 * Generate a random 6-digit OTP code
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Mock function to send SMS (Placeholder)
 * @param {string} phone - Recipient phone number
 * @param {string} code - OTP code
 */
export const sendSMSOTP = async (phone, code, lang = 'en') => {
    // If Twilio is configured, use it to send SMS. Otherwise fall back to mock logging.
    const { sid, token, from } = config.twilio;

    if (sid && token && from) {
        try {
            const client = Twilio(sid, token);
            // Localize SMS body
            const smsTemplates = {
                en: `TechStore verification code: ${code}`,
                ru: `Код подтверждения TechStore: ${code}`,
                uz: `TechStore tasdiqlash kodi: ${code}`
            };

            const body = smsTemplates[lang] || smsTemplates.en;

            const message = await client.messages.create({
                body,
                from,
                to: phone
            });
            console.log(`[SMS] Sent OTP ${code} to ${phone} via Twilio (sid: ${message.sid})`);
            return true;
        } catch (err) {
            if (err.message && err.message.includes("cannot be the same")) {
                console.warn(`[SMS] Twilio warning: Cannot send SMS from ${from} to ${phone} because they are the same number.`);
                return false;
            }
            console.error('[SMS] Twilio send error:', err && err.message ? err.message : err);
            return false;
        }
    }

    console.log(`[SMS MOCK] Twilio not configured correctly. OTP ${code} not sent to ${phone}`);
    return false;
};

/**
 * Send OTP via Email
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} code - OTP code
 */
export const sendEmailOTP = async (email, name, code, lang = 'en') => {
    const mailOptions = {
        from: config.smtp.from,
        to: email,
        subject: (lang === 'ru') ? 'TechStore – Код подтверждения' : (lang === 'uz') ? 'TechStore – Tasdiqlash kodi' : 'TechStore – Verification code',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #00b8d9;">TechStore</h2>
                    ${lang === 'ru' ? `<p>Здравствуйте, ${name}</p><p>Для подтверждения регистрации используйте следующий код:</p>` : lang === 'uz' ? `<p>Salom, ${name},</p><p>Ro'yxatdan o'tishni yakunlash uchun quyidagi koddan foydalaning:</p>` : `<p>Hello ${name},</p><p>To complete your registration, use the verification code below:</p>`}
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #00b8d9;">
                        ${code}
                    </div>
                    ${lang === 'ru' ? `<p>Код действителен в течение 10 минут. Если вы не запрашивали этот код, просто проигнорируйте это сообщение.</p>` : lang === 'uz' ? `<p>Kod 10 daqiqa davomida amal qiladi. Agar bu so'rovni siz yubormagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring.</p>` : `<p>This code is valid for 10 minutes. If you did not request this, please ignore this message.</p>`}
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666;">TechStore Team</p>
            </div>
        `
    };

    // Provide a localized plain-text fallback
    const textTemplates = {
        en: `Hello ${name},\nTechStore verification code: ${code}\nThis code is valid for 10 minutes. If you did not request this, ignore this email.\n\nTechStore Team`,
        ru: `Здравствуйте ${name},\nКод подтверждения TechStore: ${code}\nКод действителен 10 минут. Если вы не запрашивали этот код, проигнорируйте это письмо.\n\nКоманда TechStore`,
        uz: `Salom ${name},\nTechStore tasdiqlash kodi: ${code}\nKод 10 daqiqa davomida amal qiladi. Agar bu so'rovni siz yubormagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring.\n\nTechStore jamoasi`
    };

    const textBody = textTemplates[lang] || textTemplates.en;

    // Use generic sender (SendGrid preferred, SMTP fallback)
    await sendMailGeneric({ from: mailOptions.from, to: mailOptions.to, subject: mailOptions.subject, html: mailOptions.html, text: textBody });
};
