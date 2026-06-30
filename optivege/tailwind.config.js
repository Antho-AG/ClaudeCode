/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'green-deep': '#1B4332',
        'green-dark': '#2D6A4F',
        'green-mid': '#40916C',
        'green-main': '#52B788',
        'green-light': '#74C69D',
        'green-pale': '#D8F3DC',
        'green-bg': '#EEF7F0',
        'cream': '#F8F4E3',
        'cream-dark': '#EDE8D0',
        'orange-main': '#E76F51',
        'orange-light': '#F4A261',
        'orange-dark': '#C85A3C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['DM Serif Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
