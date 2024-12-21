/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class',
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#37393F', // Set your primary color
        secondary: '#45474E', // Set your secondary color
        },
    },
  },
  plugins: []
}
