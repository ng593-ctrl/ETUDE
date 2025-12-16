// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // 🛑 CRITICAL ADDITION: This prevents Tailwind from purging or interfering
    // with the internal SimpleMDE/EasyMDE classes.
    "./node_modules/easymde/dist/easymde.min.css", 
  ],
  theme: {
    extend: {
      // 🛑 NEW: Animation Keyframes and Utility Class
      animation: {
        // Defines the animation name and properties: 0.5s duration, easing, and forwards state
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          // Start State: Fully transparent and slightly pushed down (10px)
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          // End State: Fully visible (opacity 1) and in its final position (0px)
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}