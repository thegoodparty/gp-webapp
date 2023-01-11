/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Note the addition of the `app` directory.
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      purple: '#46002E',
      darkPurple: '#250018',
    },
  },
  plugins: [],
};
