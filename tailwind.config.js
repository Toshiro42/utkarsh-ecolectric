/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wool: '#0A0F0C',       // near-black green-tinted background
        ink: '#F5F7F6',        // near-white text
        madder: '#22C55E',     // eco green, primary accent/CTA/price
        sage: '#6B7A72',       // muted grey-green, secondary text/labels
        mustard: '#16211B',    // dark surface, used for pill/tag backgrounds
        thread: '#1A2620',     // dark border/divider color
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        stitch: '10px',
      },
    },
  },
  plugins: [],
}