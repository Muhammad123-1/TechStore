import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true
            },
            '/uploads': {
                target: 'http://localhost:5000',
                changeOrigin: true
            }
        }
    },
    build: {
        // Target modern browsers for better performance
        target: 'es2020',
        // Minify for smaller bundle size
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        // CSS code splitting
        cssCodeSplit: true,
        // Better chunk splitting strategy for mobile
        rollupOptions: {
            output: {
                // Optimize chunk names for caching
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
                manualChunks: (id) => {
                    // Separate vendor chunks for better caching
                    if (id.includes('node_modules')) {
                        // React core
                        if (id.includes('react-dom') || id.includes('react/')) {
                            return 'vendor-react';
                        }
                        // Router
                        if (id.includes('react-router')) {
                            return 'vendor-router';
                        }
                        // i18n
                        if (id.includes('i18next')) {
                            return 'vendor-i18n';
                        }
                        // UI libraries (framer-motion, swiper, lucide)
                        if (id.includes('framer-motion') || id.includes('swiper') || id.includes('lucide-react')) {
                            return 'vendor-ui';
                        }
                        // State and API
                        if (id.includes('zustand') || id.includes('axios')) {
                            return 'vendor-utils';
                        }
                        // Other vendors
                        return 'vendor';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 600,
        // Improve mobile performance
        sourcemap: false,
        // Split vendor chunks for better caching
        reportCompressedSize: true
    },
    // Optimize dependencies
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'zustand', 'axios', 'i18next', 'react-i18next']
    }
})
