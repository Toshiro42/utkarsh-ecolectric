/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
              wool: '#FFE9EC',      // soft blush background
              ink: '#2B2B2B',       // near-black text
              madder: '#65001E',    // deep maroon, primary accent
              sage: '#B05D76',      // dusty rose, secondary accent
              mustard: '#FFBACF',   // pink highlight
              thread: '#F0C9D2',    // muted pink for borders/dividers
            },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        stitch: '2px',
      },
    },
  },
  plugins: [],
}
