/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",        // root HTML files
    "./**/*.html",     // any nested HTML files
    "./*.js",          // JS files in root
    "./**/*.js"        // JS files in subfolders
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563eb",   // primary blue (buttons, highlights)
          dark: "#1e3a8a",   // dark navy for headers/accents
          light: "#eff6ff",  // soft blue background
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};