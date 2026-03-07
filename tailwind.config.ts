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
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          hover: "var(--primary)",
          subtle: "var(--muted)",
          text: "var(--primary-foreground)",
          2: "var(--primary)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: {
          DEFAULT: "var(--border)",
          hover: "var(--border)",
        },
        input: "var(--input)",
        ring: "var(--ring)",
        sticker: {
          pink: "var(--sticker-pink)",
          blue: "var(--sticker-blue)",
          green: "var(--sticker-green)",
          lilac: "var(--sticker-lilac)",
          yellow: "var(--sticker-yellow)",
          coral: "var(--sticker-coral)",
          olive: "var(--sticker-olive)",
        },
        bg: {
          base: "var(--background)",
          surface: "var(--card)",
          "surface-2": "var(--muted)",
          "surface-3": "var(--muted)",
          hover: "var(--muted)",
        },
        text: {
          primary: "var(--foreground)",
          secondary: "var(--muted-foreground)",
          muted: "var(--muted-foreground)",
        },
        mango: "var(--sticker-yellow)",
        gold: "var(--primary)",
        teal: "var(--sticker-blue)",
        violet: "var(--sticker-lilac)",
        rose: "var(--sticker-pink)",
        lime: "var(--sticker-green)",
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
        sticker: "16px",
        stickerLg: "24px",
        blob: "40% 60% 70% 30% / 50% 60% 40% 50%",
        blob2: "60% 40% 30% 70% / 60% 30% 70% 40%",
        blob3: "30% 70% 70% 30% / 30% 50% 50% 70%",
      },
      boxShadow: {
        sm: "0 1px 4px rgba(0, 0, 0, 0.08)",
        md: "0 4px 16px rgba(0, 0, 0, 0.10)",
        lg: "0 8px 32px rgba(0, 0, 0, 0.12)",
        accent: "0 8px 32px rgba(0, 0, 0, 0.10)",
        "accent-sm": "0 4px 16px rgba(0, 0, 0, 0.08)",
        sticker: "0 6px 0 rgba(0,0,0,0.10), 0 2px 12px rgba(0,0,0,0.06)",
        stickerSoft: "0 3px 0 rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.05)",
        stickerHover: "0 10px 0 rgba(0,0,0,0.10), 0 4px 20px rgba(0,0,0,0.08)",
        paper: "0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        paperHover: "0 6px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        stamp: "inset 0 0 0 3px var(--primary), 0 4px 0 rgba(0,0,0,0.08)",
      },
      rotate: {
        sticker: "1.5deg",
        stickerNeg: "-1.5deg",
        "sticker-2": "2.5deg",
        "sticker-3": "3.5deg",
        "stickerNeg-2": "-2.5deg",
        "stickerNeg-3": "-3.5deg",
      },
      keyframes: {
        "sticker-pop": {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "stamp-hit": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "60%": { opacity: "1", transform: "scale(1.02)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "wiggle-cta": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "spin-stamp": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "tape-peel": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "sticker-pop": "sticker-pop 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "stamp-hit": "stamp-hit 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "wiggle-cta": "wiggle-cta 3s ease-in-out infinite",
        "float-y": "float-y 4s ease-in-out infinite",
        "spin-stamp": "spin-stamp 1.2s linear infinite",
        "tape-peel": "tape-peel 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
