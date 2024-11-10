/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    // Add other folders if needed
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#D3A43E",
          "light-gold": "#E6BC6B",
          "dark-gold": "#B98C35",
          maroon: "#821426",
          "dark-maroon": "#5E0D1C",
          cream: "#F5EAD0",
          "dark-gray": "#1F1F1F",
          olive: "#6B584C",
          tan: "#C19A77",
          "cool-gray": "#4D4D4D",
        },
      },
    },
  },
  plugins: [],
};
