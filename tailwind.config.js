/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
          400: '#a78bfa', 500: '#6d28d9', 600: '#5b21b6', 700: '#4c1d95',
          800: '#3b0f70', 900: '#2e0a57'
        },
        accent: {
          50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
          400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c'
        },
        surface: {
          light: '#ffffff', dark: '#12101b'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(76, 29, 149, 0.12)',
        card: '0 2px 12px -2px rgba(0,0,0,0.08)'
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } }
      },
      animation: {
        fadeIn: 'fadeIn .4s ease-out both',
        slideUp: 'slideUp .5s ease-out both',
        scaleIn: 'scaleIn .2s ease-out both'
      }
    }
  },
  plugins: []
}
