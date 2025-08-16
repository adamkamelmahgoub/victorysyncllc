
import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx,mdx}"
  ],
  theme: {
    extend: {
      // shadcn-style tokens so `bg-background`, etc. compile
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // VictorySync brand (numeric keys so utilities compile)
        brand: {
          50:  "#F3F0FF",
          100: "#E9E4FF",
          200: "#CDC4FF",
          300: "#B0A3FF",
          400: "#907FFF",
          500: "#6C4DF6",  // main
          600: "#5A3FE0",  // hover
          700: "#4933B5",
          800: "#38288C",
          900: "#2B206C",
        },
      },
      boxShadow: {
        btn: "0 6px 16px rgba(108,77,246,0.32)",
      },
      borderRadius: {
        xl: "0.8rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
