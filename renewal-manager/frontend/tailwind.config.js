/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'tahoma', 'sans-serif'],
      },
      colors: {
        swiss: {
          dark: '#1a1a1a',
          light: '#f7f7f8'
        }
      }
    },
  },
  plugins: [],
}