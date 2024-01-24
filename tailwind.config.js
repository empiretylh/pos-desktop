/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary': '#004BAB',
      }
    },
  },
  variants: {
    extend:{
      backgroundColor: ['active'],
      textColor: ['active'],
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
}
