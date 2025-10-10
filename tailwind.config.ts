import type { Config } from "tailwindcss";

export default {
  content: ["index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#5F5AF1",
          purpleDark: "#534BF0",
          navy: "#0B1526",
          card: "#101B30",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
      },
      container: {
        center: true,
        padding: { DEFAULT: "1.5rem", md: "2rem" },
      },
      boxShadow: {
        soft: "0 6px 20px rgba(17, 24, 39, .12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
