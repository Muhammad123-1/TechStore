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
    esbuild: {
        drop: ['console', 'debugger'],
    },
    build: {
        // Target modern browsers for better performance
        target: 'es2020',
        // CSS code splitting
        cssCodeSplit: true,
        // Better chunk splitting strategy for mobile
        rollupOptions: {
            output: {
                // Optimize chunk names for caching
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
                manualChunks: {
                    react: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    ui: ['framer-motion', 'swiper', 'lucide-react'],
                    i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
                    utils: ['axios', 'zustand']
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
