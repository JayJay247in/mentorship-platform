/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme'); // Import default theme

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // --- THIS IS THE MODIFIED SECTION ---
      fontFamily: {
        // Our body font will be 'Inter'. We add the default sans-serif fonts as fallbacks.
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        // We create a new custom font family called 'display' for our headings.
        display: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      // --- END OF MODIFIED SECTION ---

      // This is our existing custom color palette
      colors: {
        'brand-primary': '#0A2540',
        'brand-secondary': '#4A90E2',
        'brand-accent': '#5469D4',
        'brand-light': '#F5F7FA',
        'brand-text': '#333333',
        'brand-text-light': '#5A6978',
        'status-success': '#28A745',
        'status-error': '#DC3545',
        'status-warning': '#FFC107',
      },
    },
  },
  plugins: [],
}