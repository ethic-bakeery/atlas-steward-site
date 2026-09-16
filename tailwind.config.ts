import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B2A4A",
          light: "#28395c",
          dark: "#10192e",
        },
        gold: {
          DEFAULT: "#B5872A",
          light: "#c9a24f",
          dark: "#8f6a1f",
        },
        ink: "#1f2430",
        paper: "#FAFAF8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,25,46,0.06), 0 4px 16px rgba(16,25,46,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
