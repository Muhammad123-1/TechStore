import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import toast from 'react-hot-toast';
import { setAccessTokenCookie, setRefreshTokenCookie, clearAuthCookies } from '../utils/cookieUtils';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            login: async (email, password) => {
                const response = await api.post('/auth/login', { email, password });
                const { user, accessToken, refreshToken } = response.data.data;

                // Store in localStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                // Store in cookies
                setAccessTokenCookie(accessToken);
                setRefreshTokenCookie(refreshToken);

                set({ user, accessToken, refreshToken, isAuthenticated: true });
                // If email not verified, trigger sending OTP (email + SMS if phone exists)
                try {
                    if (!user.isEmailVerified) {
                        await api.post('/auth/send-otp');
                        toast('Verification code sent to your email/phone', { icon: '✉️' });
                    }
                } catch (err) {
                    console.error('Failed to send verification OTP after login', err);
                }
                return response.data;
            },

            register: async (userData) => {
                const response = await api.post('/auth/register', userData);

                // If backend immediately returned tokens (rare), persist them.
                const accessToken = response.data?.data?.accessToken;
                const refreshToken = response.data?.data?.refreshToken;
                const user = response.data?.data?.user || null;

                if (accessToken && refreshToken) {
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    setAccessTokenCookie(accessToken);
                    setRefreshTokenCookie(refreshToken);
                    set({ user, accessToken, refreshToken, isAuthenticated: true });
                } else {
                    // Registration entered pending state (OTP required). Do not authenticate yet.
                    // Store pending email for the OTP page to use.
                    if (userData.email) localStorage.setItem('pendingEmail', userData.email);
                    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
                }

                return response.data;
            },

            logout: async () => {
                try {
                    await api.post('/auth/logout');
                } catch (error) {
                    console.error('Logout error:', error);
                }

                // Clear localStorage
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Clear cookies
                clearAuthCookies();

                set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
            },

            addToWishlist: async (productId) => {
                try {
                    const response = await api.post(`/users/wishlist/${productId}`);
                    set((state) => ({
                        user: {
                            ...state.user,
                            wishlist: [...state.user.wishlist, productId]
                        }
                    }));
                    return response.data;
                } catch (error) {
                    console.error('Add to wishlist error:', error);
                    throw error;
                }
            },

            removeFromWishlist: async (productId) => {
                try {
                    const response = await api.delete(`/users/wishlist/${productId}`);
                    set((state) => ({
                        user: {
                            ...state.user,
                            wishlist: state.user.wishlist.filter(id => id !== productId)
                        }
                    }));
                    return response.data;
                } catch (error) {
                    console.error('Remove from wishlist error:', error);
                    throw error;
                }
            },

            updateUser: (user) => {
                set({ user });
            },

            forgotPassword: async (email) => {
                const response = await api.post('/auth/forgot-password', { email });
                return response.data;
            },

            resetPassword: async (token, newPassword) => {
                const response = await api.post(`/auth/reset-password/${token}`, { password: newPassword });
                return response.data;
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);
