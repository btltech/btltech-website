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
          DEFAULT: "#0f172a", // Deep Navy (Slate 900)
          primary: "#2563eb", // Electric Blue
          secondary: "#0ea5e9", // Sky Blue
          accent: "#f59e0b",  // Amber
          dark: "#020617",    // Almost Black
          light: "#f8fafc",   // Off White
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      borderRadius: {
        'xl': "1rem",
        '2xl': "1.5rem",
        '3xl': "2rem",
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      }
    },
  },
  plugins: [],
};