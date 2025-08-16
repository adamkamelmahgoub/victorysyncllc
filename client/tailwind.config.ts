export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // VictorySync brand violet (solid buttons)
        vs: {
          violet: "#6C4DF6",
          violetHover: "#5a3fe0",
        },
      },
      boxShadow: {
        "btn": "0 6px 16px rgba(108,77,246,0.32)",
      },