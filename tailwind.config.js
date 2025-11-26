/* eslint-env node */
/* eslint-disable no-undef */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      "light",
      "dark",
      {
        cupcake: {
          ...require("daisyui/src/theming/themes")["cupcake"],
          primary: '#c9a3ff', // A lighter, more pastel purple
          secondary: '#f9d7d9', // A soft pink
          accent: '#fde4a4', // A gentle yellow
          neutral: '#f3f4f6', // A very light gray for neutral backgrounds
          'base-100': '#ffffff', // Pure white for the main background
          'base-200': '#f9fafb', // Slightly off-white for secondary backgrounds
          'base-300': '#f3f4f6', // A light gray for borders and dividers
        },
      },
    ],
  },
}
