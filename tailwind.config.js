/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        "primary-foreground": "#ffffff",

        secondary: {
          DEFAULT: "#64748b",
        },
        "secondary-foreground": "#ffffff",

        destructive: "#dc2626",
        "destructive-foreground": "#ffffff",

        card: "#ffffff",
        "card-foreground": "#0f172a",

        muted: "#f1f5f9",
        "muted-foreground": "#64748b",

        popover: "#ffffff",
        "popover-foreground": "#0f172a",

        border: "#e2e8f0",
        input: "#e2e8f0",

        ring: "#3b82f6",
        background: "#ffffff",
        foreground: "#0f172a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
