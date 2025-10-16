/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.json"
  ],
  safelist: [
    // Pathway gradient colors - safelist to ensure dynamic colors work
    'from-blue-500', 'to-cyan-500',
    'from-purple-500', 'to-pink-500',
    'from-green-500', 'to-emerald-500',
    'from-yellow-500', 'to-orange-500', 'to-orange-600',
    'from-rose-500', 'to-red-500',
    'from-indigo-500', 'to-purple-500',
    'from-teal-500', 'to-green-500',
    'from-slate-500', 'to-gray-500',
    'from-violet-500', 'to-purple-500',
    'from-amber-500', 'to-yellow-500', 'to-amber-800',
    'from-sky-500', 'to-blue-500',
    'from-emerald-500', 'to-teal-500',
    'from-pink-500', 'to-rose-500',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
      },
      boxShadow: {
        paper: "var(--paper-shadow)",
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-out",
        "gradient-x": "gradient-x 2s ease infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(5px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-position": "0% 50%"
          },
          "50%": {
            "background-position": "100% 50%"
          },
        },
      },
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
  darkMode: "class",
};