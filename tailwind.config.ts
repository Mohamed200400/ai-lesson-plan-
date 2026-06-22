import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Gedada Academic Intelligence palette
        surface: "#f7f9fb",
        "surface-dim": "#d8dadc",
        "surface-bright": "#f7f9fb",
        "surface-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-high": "#e6e8ea",
        "on-surface": "#191c1e",
        "on-surface-variant": "#424750",
        outline: "#737781",
        "outline-variant": "#c3c6d1",
        primary: {
          DEFAULT: "#003466",
          container: "#1a4b84",
          fixed: "#d5e3ff",
          glow: "#93bcfc",
        },
        secondary: {
          DEFAULT: "#006492",
          container: "#58bcfd",
        },
        ai: "#2D9CDB", // Growth Green / AI accent
        "ai-soft": "#e8f5ec",
        "ai-tint": "#eaf5ee",
        success: "#16a34a",
        danger: "#ba1a1a",
        paper: "#ffffff",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["40px", { lineHeight: "52px", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "title-lg": ["20px", { lineHeight: "28px", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "400" }],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      boxShadow: {
        card: "0 4px 12px rgba(26, 75, 132, 0.05)",
        "card-hover": "0 8px 24px rgba(26, 75, 132, 0.08)",
        focus: "0 0 0 4px rgba(0, 52, 102, 0.12)",
      },
      maxWidth: { container: "1280px" },
    },
  },
  plugins: [],
};
export default config;
