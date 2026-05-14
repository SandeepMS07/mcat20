/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#060F19",
        foreground: "var(--foreground)",
      },
      screens: {
        "3xl": "1800px",
        "4xl": "2000px",
        "5xl": "2500px",
        "6xl": "3000px"
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(90deg, rgba(68, 68, 68, 1) 0%, rgba(23, 74, 140, 1) 50%, rgba(255, 255, 255, 1) 100%)',
        'text-gradient': 'linear-gradient(90deg, #909DC1 0%, #3663DE 100%)',
      },
      fontFamily: {
        figtree: ['Figtree', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        sen: ['Sen', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
