/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wool: '#0A0F0C',
        ink: '#F5F7F6',
        madder: '#5DCD09',    // matched to your logo's green
        sage: '#6B7A72',
        mustard: '#16211B',
        thread: '#1A2620',
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