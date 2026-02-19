/**
 * Cookie middleware for Express.js
 * Handles secure cookie configuration for tokens
 */

import express from 'express';

export const cookieMiddleware = (app) => {
    // Set secure cookie defaults
    app.use((req, res, next) => {
        // Override res.cookie with secure defaults
        const originalCookie = res.cookie.bind(res);
        
        res.cookie = function(name, val, options = {}) {
            const secureCookieOptions = {
                httpOnly: true, // Prevent JS access (XSS protection)
                secure: process.env.NODE_ENV === 'production', // HTTPS only in production
                sameSite: 'Strict', // CSRF protection
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days default
                ...options
            };
            
            return originalCookie(name, val, secureCookieOptions);
        };
        
        next();
    });
};

// Helper to set tokens as cookies in response
export const setTokenCookies = (res, accessToken, refreshToken) => {
    // Access token: short-lived, httpOnly
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: '/'
    });

    // Refresh token: long-lived, httpOnly
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
        signed: true // Sign cookie to prevent tampering
    });
};

// Helper to clear token cookies
export const clearTokenCookies = (res) => {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/', signed: true });
};

// Middleware to extract tokens from cookies
export const extractTokensFromCookies = (req, res, next) => {
    // Check cookies for tokens (httpOnly cookies are auto-included by browser)
    // Express with cookie-parser will populate req.cookies
    
    if (req.cookies && req.cookies.accessToken && !req.headers.authorization) {
        // If token exists in cookie but not in header, add it to header for auth middleware
        req.headers.authorization = `Bearer ${req.cookies.accessToken}`;
    }
    
    next();
};

export default {
    cookieMiddleware,
    setTokenCookies,
    clearTokenCookies,
    extractTokensFromCookies
};
