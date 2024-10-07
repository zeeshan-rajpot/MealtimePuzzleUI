/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#001B57",
        // primary: "linear-gradient(90deg, hsla(200, 100%, 30%, 1) 0%, hsla(238, 74%, 61%, 1) 100%);",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(90deg, hsla(200, 100%, 30%, 1) 0%, hsla(238, 74%, 61%, 1) 100%);",
      },
      boxShadow: {
        "custom-shadow": "0 2px 16px 0 rgba(0, 0, 0, 0.12)",
        "custom-hover-shadow": "0 4px 20px 0 rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
