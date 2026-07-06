/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#1A1A2E',
          secondary: '#16213E',
          card: '#0F3460',
        },
        accent: '#E94560',
        text: {
          primary: '#F1F1F1',
          secondary: '#A0AEC0',
        },
        success: '#48BB78',
        danger: '#FC8181',
        neutral: '#F6AD55',
        sport: {
          foot: '#4CAF50',
          nba: '#FF6B35',
          turf: '#8B5CF6',
          autres: '#06B6D4',
        },
        mindmap: {
          root: '#E94560',
          l1: {
            1: '#FF6B6B',
            2: '#4ECDC4',
            3: '#45B7D1',
            4: '#96CEB4',
            5: '#FFEAA7',
            6: '#DDA0DD',
            7: '#98D8C8',
            8: '#F7DC6F',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
