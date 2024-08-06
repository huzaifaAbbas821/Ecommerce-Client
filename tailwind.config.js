/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '500px',
      },
    },
  },
  plugins: [],
}

// const defaultTheme = require('tailwindcss/defaultTheme')

// module.exports = {
//   theme: {
//     screens: {
//       'xs': '500px',
//       ...defaultTheme.screens,
//     },
//   },
//   plugins: [],
// }