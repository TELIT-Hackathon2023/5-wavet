/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        'desktop': '1680px',
      },
      width: {
        'functional': '80vw'
      },
      colors: {
        'web-gray': '#232323',
        'accent': "#e20074",
        'accent-light': "#ed93c1",
        'borders': "#D9D9D9",
        'dark-text': "#848484",
        'admin-gray': "#d4d4d4"
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    }
  ],
}