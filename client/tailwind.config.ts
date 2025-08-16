
import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Canonical brand palette (numeric keys so utilities compile)
        brand: {
          50:  "#F3F0FF",
          100: "#E9E4FF",
          200: "#CDC4FF",
          300: "#B0A3FF",
          400: "#907FFF",
          500: "#6C4DF6",   // primary
          600: "#5A3FE0",   // hover
          700: "#4933B5",
          800: "#38288C",
          900: "#2B206C"
        },
      },
      boxShadow: {
        btn: "0 6px 16px rgba(108,77,246,0.32)",
      },
    },
  },
  plugins: [],
} satisfies Config;
