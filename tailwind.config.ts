import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        sm: "0.375rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.75rem",
      },

      boxShadow: {
        soft: "0 6px 20px rgba(0,0,0,0.08)",
        card: "0 10px 30px rgba(0,0,0,0.10)",
        glow: "0 0 0 0 rgba(26,115,232,0.4)",
      },

      colors: {
        /* ================= GOOGLE MAPS STYLE COLORS ================= */

        // Base system (ShadCN compatible)
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",

        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          border: "hsl(var(--card-border) / <alpha-value>)",
        },

        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          border: "hsl(var(--popover-border) / <alpha-value>)",
        },

        primary: {
          DEFAULT: "#1a73e8", // Google Blue
          foreground: "#ffffff",
          border: "#1a73e8",
        },

        secondary: {
          DEFAULT: "#34a853", // Google Green
          foreground: "#ffffff",
          border: "#34a853",
        },

        accent: {
          DEFAULT: "#fbbc04", // Google Yellow
          foreground: "#202124",
          border: "#fbbc04",
        },

        destructive: {
          DEFAULT: "#ea4335", // Google Red
          foreground: "#ffffff",
          border: "#ea4335",
        },

        muted: {
          DEFAULT: "#f1f3f4",
          foreground: "#5f6368",
          border: "#dadce0",
        },

        ring: "#1a73e8",

        /* ================= SIDEBAR THEME ================= */

        sidebar: {
          DEFAULT: "#ffffff",
          foreground: "#202124",
          border: "#dadce0",
          ring: "#1a73e8",
        },

        "sidebar-primary": {
          DEFAULT: "#1a73e8",
          foreground: "#ffffff",
          border: "#1a73e8",
        },

        "sidebar-accent": {
          DEFAULT: "#e8f0fe",
          foreground: "#1a73e8",
          border: "#d2e3fc",
        },

        /* ================= STATUS COLORS ================= */

        status: {
          online: "#34a853",
          away: "#fbbc04",
          busy: "#ea4335",
          offline: "#9aa0a6",
        },

        /* ================= CHART COLORS ================= */

        chart: {
          1: "#1a73e8",
          2: "#34a853",
          3: "#fbbc04",
          4: "#ea4335",
          5: "#9334e6",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 0 rgba(26,115,232,0.0)" },
          "100%": { boxShadow: "0 0 20px rgba(26,115,232,0.3)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        fadeIn: "fadeIn 0.4s ease-out",
        glow: "glow 1.5s infinite alternate",
      },
    },
  },

  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
