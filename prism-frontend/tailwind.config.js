/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#05050a",
          900: "#0a0a12",
          800: "#10101c",
          700: "#181828",
        },
        prism: {
          violet: "#8b5cf6",
          blue: "#3b82f6",
          cyan: "#06b6d4",
          magenta: "#d946ef",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        display: ['"Syne"', "sans-serif"],
        body: ['"Plus Jakarta Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        "prism-spin": "prism-spin 3s linear infinite",
        "fade-up": "fade-up 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "prism-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
