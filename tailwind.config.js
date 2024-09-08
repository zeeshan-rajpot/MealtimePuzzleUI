/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#02A9D6',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #62DEFF, #02A9D6)',
      },
      boxShadow: {
        'custom-shadow': '0 2px 16px 0 rgba(0, 0, 0, 0.12)', 
        'custom-hover-shadow': '0 4px 20px 0 rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}