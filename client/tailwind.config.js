/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        
        'sm': '900px',
        'md': '1006px',
        '2md': '1025px',
        '3md': '1100px',
        '4md': '1250px',
        'lg': '1360px',
        'xl': '1430px',

    
      },
    },
  },
  plugins: [],
}