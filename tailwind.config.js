/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'animate-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'animate-in': 'animate-in 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}