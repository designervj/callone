import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
        surface: "var(--surface)",
        primary: "var(--primary)",
        border: "var(--border)",
        success: "var(--success)",
        danger: "var(--danger)",
        card: "var(--surface)",
        "card-foreground": "var(--surface-foreground)",
        accent: "var(--accent)",
        muted: "var(--muted)",
        "accent-yellow": "var(--accent-yellow)",
        "accent-blue": "var(--accent-blue)",
        "accent-green": "var(--accent-green)",
        "accent-pink": "var(--accent-pink)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
