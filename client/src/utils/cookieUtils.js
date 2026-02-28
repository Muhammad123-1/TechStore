/**
 * Cookie utility functions for secure token and session management
 */

// Set cookie with secure options
export const setCookie = (name, value, options = {}) => {
    const defaultOptions = {
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        sameSite: 'Strict',
        secure: process.env.NODE_ENV === 'production'
    };

    const cookieOptions = { ...defaultOptions, ...options };
    
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (cookieOptions.maxAge) {
        cookieString += `; Max-Age=${cookieOptions.maxAge}`;
    }
    if (cookieOptions.path) {
        cookieString += `; Path=${cookieOptions.path}`;
    }
    if (cookieOptions.domain) {
        cookieString += `; Domain=${cookieOptions.domain}`;
    }
    if (cookieOptions.sameSite) {
        cookieString += `; SameSite=${cookieOptions.sameSite}`;
    }
    if (cookieOptions.secure) {
        cookieString += '; Secure';
    }
    if (cookieOptions.httpOnly) {
        cookieString += '; HttpOnly';
    }

    document.cookie = cookieString;
};

// Get cookie value
export const getCookie = (name) => {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return null;
};

// Delete cookie
export const deleteCookie = (name, options = {}) => {
    setCookie(name, '', {
        ...options,
        maxAge: -1
    });
};

// Get all cookies
export const getAllCookies = () => {
    const cookies = {};
    document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
            cookies[decodeURIComponent(name)] = decodeURIComponent(value);
        }
    });
    return cookies;
};

// Clear all cookies
export const clearAllCookies = () => {
    document.cookie.split(';').forEach(cookie => {
        const cookieName = cookie.split('=')[0].trim();
        if (cookieName) {
            deleteCookie(cookieName);
        }
    });
};

// Cookie names constants
export const COOKIE_NAMES = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_PREF: 'userPreferences',
    SESSION_ID: 'sessionId',
    LANGUAGE: 'language',
    THEME: 'theme'
};

// Set access token cookie (short-lived, httpOnly on server)
export const setAccessTokenCookie = (token) => {
    setCookie(COOKIE_NAMES.ACCESS_TOKEN, token, {
        maxAge: 15 * 60, // 15 minutes
        sameSite: 'Strict',
        secure: true
    });
};

// Set refresh token cookie (long-lived)
export const setRefreshTokenCookie = (token) => {
    setCookie(COOKIE_NAMES.REFRESH_TOKEN, token, {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        sameSite: 'Strict',
        secure: true
    });
};

// Get stored tokens from cookies
export const getTokensFromCookies = () => {
    return {
        accessToken: getCookie(COOKIE_NAMES.ACCESS_TOKEN),
        refreshToken: getCookie(COOKIE_NAMES.REFRESH_TOKEN)
    };
};

// Clear auth cookies
export const clearAuthCookies = () => {
    deleteCookie(COOKIE_NAMES.ACCESS_TOKEN);
    deleteCookie(COOKIE_NAMES.REFRESH_TOKEN);
};

export default {
    setCookie,
    getCookie,
    deleteCookie,
    getAllCookies,
    clearAllCookies,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    getTokensFromCookies,
    clearAuthCookies,
    COOKIE_NAMES
};
