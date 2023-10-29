/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    fontFamily: {
      display: ["var(--font-londrina-solid)"],
      body: ["var(--font-inter)"],
    },
    extend: {
      keyframes: ({ theme }) => ({
        fontSize: {
          base: "20px", // Sets default rem size to 20px
        },
        rerender: {
          "0%": {
            ["border-color"]: theme("colors.vercel.pink"),
          },
          "40%": {
            ["border-color"]: theme("colors.vercel.pink"),
          },
        },
        highlight: {
          "0%": {
            background: theme("colors.vercel.pink"),
            color: theme("colors.white"),
          },
          "40%": {
            background: theme("colors.vercel.pink"),
            color: theme("colors.white"),
          },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        translateXReset: {
          "100%": {
            transform: "translateX(0)",
          },
        },
        fadeToTransparent: {
          "0%": {
            opacity: 1,
          },
          "40%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
          },
        },
        // header: {

        // },
        colors: {
          nav: "linear-gradient(90deg, #171717 0%, #000000 100%)", // Dark mode gradient
          // Add more dark mode colors as needed
          card: "#1A1D26",
        },
        letterSpacing: {
          tight: "-0.02em",
          normal: "0",
          wide: "0.05em",
          wider: "0.12em",
        },
      }),
      test: {
        color: "blue",
        // letterSpacing: "0.05rem",
        uppercase: "uppercase",
        fontSize: "1rem",
      },
    },
  },
  plugins: [],
};
