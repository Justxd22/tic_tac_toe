/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        newrocker: ['"New Rocker"', 'cursive'],
      },
      backgroundImage: {
        "result-background": "url('./src/assets/images/resultBackground.png')",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 var(--pulse-color)" },
          "50%": { boxShadow: "0 0 0 8px var(--pulse-color)" },
        },
      },
      animation: {
        pulse: "pulse var(--duration) ease-out infinite",
      },
    },
  },
  plugins: [],
};
