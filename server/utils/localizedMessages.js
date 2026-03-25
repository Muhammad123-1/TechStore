const messages = {
    invalid_credentials: {
        uz: "Email yoki parol noto'g'ri",
        ru: "Неверный адрес электронной почты или пароль",
        en: "Invalid email or password"
    },
    account_locked: {
        uz: "Xavfsizlik sababli hisobingiz vaqtincha muzlatilgan. Iltimos keyinroq urinib ko'ring yoki pochtangizni tekshiring.",
        ru: "Ваша учетная запись временно заморожена в целях безопасности. Пожалуйста, попробуйте позже или проверьте почту.",
        en: "Your account has been temporarily frozen for security reasons. Please try again later or check your email."
    },
    account_locked_errors: {
        uz: "Hisobingiz vaqtincha muzlatildi (10 ta xato). Xavfsizlik bo'yicha emailingizga xabar yuborildi.",
        ru: "Ваша учетная запись временно заморожена (10 ошибок). На вашу почту отправлено предупреждение о безопасности.",
        en: "Your account has been temporarily frozen (10 errors). A security alert has been sent to your email."
    },
    registration_start: {
        uz: "Ro'yxatdan o'tish boshlandi. Tasdiqlash uchun emailingizga/telefoningizga yuborilgan kodni kiriting.",
        ru: "Регистрация началась. Пожалуйста, введите код, отправленный на вашу электронную почту/телефон, для завершения проверки.",
        en: "Registration started. Please enter the OTP sent to your email/phone to complete verification."
    },
    password_reset_otp: {
        uz: "Parolni tiklash kodi emailingizga va telefoningizga yuborildi",
        ru: "OTP для сброса пароля отправлен на вашу электронную почту и телефон",
        en: "Password reset OTP sent to your email and phone"
    },
    otp_resent: {
        uz: "Tasdiqlash kodi qaytadan yuborildi",
        ru: "Код подтверждения был отправлен повторно",
        en: "Verification code has been resent"
    },
    otp_invalid: {
        uz: "Tasdiqlash kodi noto'g'ri",
        ru: "Неверный код подтверждения",
        en: "Invalid verification code"
    },
    otp_expired: {
        uz: "Tasdiqlash kodi muddati tugagan",
        ru: "Срок действия кода подтверждения истек",
        en: "Verification code has expired"
    },
    account_verified: {
        uz: "Hisobingiz muvaffaqiyatli tasdiqlandi",
        ru: "Ваша учетная запись успешно подтверждена",
        en: "Your account has been successfully verified"
    },
    email_in_use: {
        uz: "Ushbu email allaqachon ro'yxatdan o'tgan",
        ru: "Этот адрес электронной почты уже используется",
        en: "Email already in use"
    },
    user_not_found: {
        uz: "Foydalanuvchi topilmadi",
        ru: "Пользователь не найден",
        en: "User not found"
    },
    incorrect_password: {
        uz: "Hozirgi parol noto'g'ri",
        ru: "Текущий пароль неверен",
        en: "Current password is incorrect"
    },
    profile_updated: {
        uz: "Profil ma'lumotlari muvaffaqiyatli yangilandi",
        ru: "Профиль успешно обновлен",
        en: "Profile updated successfully"
    },
    password_changed: {
        uz: "Parol muvaffaqiyatli o'zgartirildi",
        ru: "Пароль успешно изменен",
        en: "Password changed successfully"
    }
};

/**
 * Gets a localized message based on the key and language.
 * @param {string} key - The message key.
 * @param {string} lang - The language code ('uz', 'ru', 'en').
 * @returns {string} - The localized message.
 */
export const getLocalizedMessage = (key, lang = 'en') => {
    const language = ['uz', 'ru', 'en'].includes(lang) ? lang : 'en';
    return messages[key]?.[language] || messages[key]?.['en'] || key;
};

export default messages;
