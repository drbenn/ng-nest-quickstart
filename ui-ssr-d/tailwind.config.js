/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'forest', 'sunset', 'garden', 'fantasy', 'dracula', 'cmyk', 'acid', 'winter', 'dim'],
  },
  plugins: [require("daisyui")],
}

