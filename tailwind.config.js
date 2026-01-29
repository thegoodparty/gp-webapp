// Tailwind v4 configuration
// Note: In Tailwind v4, most configuration moves to CSS via @theme
// This file is kept for plugins and legacy compatibility

/** @type {import('tailwindcss').Config} */
module.exports = {
  // In Tailwind v4, content is auto-detected from @source in CSS
  // But we can still specify it here as a fallback
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styleguide/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
