/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        dark: {
          bg: '#0F0F12',
          card: '#121216',
          panel: '#1A1B1F',
        },
        neon: {
          purple: '#A06BFF',
          cyan: '#4FF0E8',
          blue: '#4D7CFE',
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'ripple': 'ripple 0.6s linear',
        'slow-spin': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-drop': 'bounce-drop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ripple-spread': 'ripple-spread 1s ease-out infinite',
        'laser-scan': 'laser-scan 2s linear infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-drop': {
          '0%': { transform: 'translateY(-50px)', opacity: '0' },
          '60%': { transform: 'translateY(10px)', opacity: '1' },
          '100%': { transform: 'translateY(0)' },
        },
        'ripple-spread': {
          '0%': { boxShadow: '0 0 0 0 rgba(160, 107, 255, 0.4)' },
          '70%': { boxShadow: '0 0 0 20px rgba(160, 107, 255, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(160, 107, 255, 0)' },
        },
        'laser-scan': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'neon-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px rgba(160, 107, 255, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 8px rgba(160, 107, 255, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}

