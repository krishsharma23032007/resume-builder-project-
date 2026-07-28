import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brutal: {
          yellow: "#ffe17c",
          charcoal: "#171e19",
          sage: "#b7c6c2",
          ink: "#000000",
          paper: "#ffffff",
          smoke: "#f4f4f5",
          line: "#272727",
          star: "#ffbc2e"
        },
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        }
      },
      boxShadow: {
        soft: "4px 4px 0px 0px #000000",
        hard: "4px 4px 0px 0px #000000",
        "hard-lg": "8px 8px 0px 0px #000000",
        browser: "12px 12px 0px 0px #000000"
      },
      fontFamily: {
        sans: ["Satoshi", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Cabinet Grotesk", "Satoshi", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
