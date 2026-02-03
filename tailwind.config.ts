import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff00ff',
          cyan: '#00ffff',
          green: '#00ff00',
          purple: '#bf00ff',
          blue: '#0066ff',
          yellow: '#ffff00',
        },
        dark: {
          900: '#0a0a0f',
          800: '#12121a',
          700: '#1a1a25',
          600: '#252532',
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'rgb-cycle': 'rgb-cycle 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'rgb-cycle': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        }
      },
      boxShadow: {
        'neon-pink': '0 0 20px rgba(255, 0, 255, 0.5)',
        'neon-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
        'neon-green': '0 0 20px rgba(0, 255, 0, 0.5)',
      }
    },
  },
  plugins: [],
} satisfies Config
