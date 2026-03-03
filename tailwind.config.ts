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
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          subtle: 'var(--accent-subtle)',
          text: 'var(--accent-text)',
          2: 'var(--accent-2)',
        },
        mango: 'var(--cover-mango)',
        gold: 'var(--cover-gold)',
        teal: 'var(--cover-teal)',
        violet: 'var(--cover-violet)',
        rose: 'var(--cover-rose)',
        lime: 'var(--cover-lime)',
        danger: 'var(--danger)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        bg: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          'surface-2': 'var(--bg-surface-2)',
          'surface-3': 'var(--bg-surface-3)',
          hover: 'var(--bg-hover)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        accent: 'var(--shadow-accent)',
        'accent-sm': 'var(--shadow-accent-sm)',
      },
    },
  },
  plugins: [],
};

export default config;
