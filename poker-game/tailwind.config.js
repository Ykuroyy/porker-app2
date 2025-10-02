/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        poker: {
          green: '#0F5132',
          felt: '#1B4332',
          gold: '#FFD700',
          red: '#DC3545',
          blue: '#0D6EFD',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}