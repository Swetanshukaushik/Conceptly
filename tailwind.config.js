/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B1220',
          secondary: '#0F1B2E',
          card: '#0E1728'
        },
        text: {
          primary: '#E8EEF9',
          secondary: '#A9B4CA',
          muted: '#7B879F'
        },
        brand: {
          50: '#EAF3FF',
          100: '#CFE5FF',
          200: '#9CCEFF',
          300: '#63B5FF',
          400: '#2D8DFF',
          500: '#0F6BFF',
          600: '#0850C7',
          700: '#083F9B',
          800: '#072B6D',
          900: '#061E52'
        },
        danger: {
          500: '#EF4444'
        },
        border: {
          DEFAULT: 'rgba(231, 238, 251, 0.14)'
        }
      },
      spacing: {
        18: '4.5rem'
      },
      borderRadius: {
        xl: 22
      },
      boxShadow: {
        soft: '0px 10px 30px rgba(0, 0, 0, 0.35)'
      }
    }
  },
  plugins: []
};

