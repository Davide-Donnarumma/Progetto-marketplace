import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coastal: {
          50: "#f6f7f9", // Sfondo chiarissimo, arioso
          100: "#eceef2",
          200: "#d5d9e3",
          300: "#b1b9c9",
          400: "#8693a9",
          500: "#65748e",
          600: "#505c75",
          700: "#414b60",
          800: "#384152",
          900: "#0f172a", // Blu notte profondo per testi primari e bottoni
        },
        gold: {
          DEFAULT: "#D4AF37", // Per badge lusso/stelle
          light: "#F3E5AB",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
