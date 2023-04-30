/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Note the addition of the `app` directory.
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: '#46002E',
        darkPurple: '#250018',
        'gp-yellow': '#FFE600',
      },
    },
  },
  plugins: [],
};
