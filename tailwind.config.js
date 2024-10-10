/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ceruleanBlue: "#006699",  // Cerulean Blue
        blushPink: "#BB6F7A",     // Blush Pink
        deepSkyBlue: "#003c68",   // Deep Sky Blue
      },
      boxShadow: {
        "custom-shadow": "0 2px 16px 0 rgba(0, 0, 0, 0.12)",
        "custom-hover-shadow": "0 4px 20px 0 rgba(0, 0, 0, 0.25)",
      },
      fontFamily: {
        sans: ['Meta Normal', 'sans-serif'], // Include Meta Normal
      },
    },
  },
  plugins: [],
};
