/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#101C30', 800: '#16253D', 700: '#1D2F4B' },
        ivory: { DEFAULT: '#F5F1E8', 200: '#EDE7D8' },
        gold: { DEFAULT: '#B99A62', 300: '#D2BC90', 600: '#9C7F4A' },
        charcoal: '#252B35',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16,28,48,.04), 0 12px 32px -12px rgba(16,28,48,.18)',
        lift: '0 2px 4px rgba(16,28,48,.06), 0 28px 56px -20px rgba(16,28,48,.35)',
      },
      keyframes: {
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-18px,0)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        drift: 'drift 14s ease-in-out infinite',
        sweep: 'sweep 9s linear infinite',
      },
    },
  },
  plugins: [],
};
