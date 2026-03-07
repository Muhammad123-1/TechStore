/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
                'dark-base': 'rgb(var(--color-bg-base-rgb) / <alpha-value>)',
                'dark-secondary': 'rgb(var(--color-bg-secondary-rgb) / <alpha-value>)',
                'dark-card': 'rgb(var(--color-bg-card-rgb) / <alpha-value>)',
                'text-primary': 'rgb(var(--color-text-primary-rgb) / <alpha-value>)',
                'text-secondary': 'rgb(var(--color-text-secondary-rgb) / <alpha-value>)',
                'border-color': 'rgb(var(--color-border-rgb) / <alpha-value>)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                glow: '0 0 20px rgb(var(--color-primary-rgb) / 0.4)',
                'glow-lg': '0 0 40px rgb(var(--color-primary-rgb) / 0.6)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in',
                'slide-up': 'slideUp 0.4s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
