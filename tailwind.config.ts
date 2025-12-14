import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/mdx-components.tsx"
  ],
  theme: {
    extend: {
      colors: {
        base: "#0f172a",
        primary: {
          DEFAULT: "#6d28d9",
          foreground: "#f5f3ff"
        },
        secondary: {
          DEFAULT: "#4c1d95",
          foreground: "#ede9fe"
        },
        card: {
          DEFAULT: "rgba(15,23,42,0.75)",
          foreground: "#f8fafc"
        },
        muted: {
          DEFAULT: "#1e1b4b",
          foreground: "#c4b5fd"
        }
      },
      backgroundImage: {
        "lux-gradient": "linear-gradient(135deg,#4c1d95 0%,#6d28d9 60%,#0f172a 100%)"
      },
      borderRadius: {
        xl: "1.5rem",
        "2xl": "2rem"
      },
      boxShadow: {
        neon: "0 10px 60px rgba(109,40,217,0.35)"
      },
      fontFamily: {
        sans: ["'Space Grotesk'", ...fontFamily.sans]
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
