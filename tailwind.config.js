/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*{js,jsx,ts,tsx}', './com/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        example: ['ExampleFontFamily'],
      },
      colors: {
        primary: '#C1D3AD',
      },
    },
  },
  plugins: [],
};
