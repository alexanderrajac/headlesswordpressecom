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
        wood: {
          50: "#fdf8f4",
          100: "#f9ede0",
          200: "#f0d8bc",
          300: "#e4bc8e",
          400: "#d49a5e",
          500: "#c8803c",
          600: "#8B5E3C",
          700: "#7a4f30",
          800: "#65402a",
          900: "#533525",
        },
        cream: {
          DEFAULT: "#F5F1E8",
          50: "#fdfcf8",
          100: "#F5F1E8",
          200: "#ede5d0",
          300: "#ddd4b4",
        },
        charcoal: {
          DEFAULT: "#2F2F2F",
          light: "#4a4a4a",
          dark: "#1a1a1a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.35s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "wood": "0 4px 24px rgba(139, 94, 60, 0.15)",
        "wood-lg": "0 8px 40px rgba(139, 94, 60, 0.25)",
        "card": "0 2px 16px rgba(47, 47, 47, 0.08)",
        "card-hover": "0 8px 32px rgba(47, 47, 47, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
