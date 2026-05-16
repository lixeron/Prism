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
        display: ['"Unbounded"', "sans-serif"],
        body: ['"Plus Jakarta Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
