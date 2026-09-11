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
        // ZedPrep brand palette
        // Primary: deep Zambian green
        // Accent: warm gold
        brand: {
          50: "#f0f9f4",
          100: "#dcf2e3",
          200: "#bce5cb",
          300: "#8dd1a8",
          400: "#5ab87f",
          500: "#369d5d",
          600: "#1f8048",
          700: "#0E7C3A", // primary brand
          800: "#136132",
          900: "#11502b",
        },
        accent: {
          50: "#fdf9ed",
          100: "#faf0cd",
          200: "#f5e19a",
          300: "#F2C744", // primary accent
          400: "#edb32a",
          500: "#de9617",
          600: "#c47713",
          700: "#a35a14",
          800: "#854718",
          900: "#6f3b18",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
