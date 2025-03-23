/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Parrot-inspired color palette
        parrot: {
          orange: '#FF7A59',
          'orange-dark': '#F15B2A',
          'orange-light': '#FFBDAD',
          blue: '#2E475D',
          'blue-dark': '#213343',
          'blue-light': '#CBD6E2',
          green: '#00BDA5',
          'green-dark': '#0AA88F',
          'green-light': '#BFEBE5',
          red: '#E34F32',
          gray: {
            50: '#F5F8FA',
            100: '#EAF0F6',
            200: '#D6DFE8',
            300: '#B9C5D5',
            400: '#8696A7',
            500: '#516F90',
            600: '#354E6F',
            700: '#2E475D',
            800: '#213343',
            900: '#152434',
          }
        },
        // Shadcn UI required colors
        border: "hsl(214.3 31.8% 91.4%)",
        input: "hsl(214.3 31.8% 91.4%)",
        ring: "hsl(222.2 84% 4.9%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
        primary: {
          DEFAULT: "hsl(221.2 83.2% 53.3%)",
          foreground: "hsl(210 40% 98%)",
        },
        secondary: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(222.2 47.4% 11.2%)",
        },
        muted: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(215.4 16.3% 46.9%)",
        },
        accent: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(222.2 47.4% 11.2%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 84% 4.9%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(210 40% 98%)",
        },
      },
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
        lexend: ['Lexend', 'sans-serif'],
      },
      boxShadow: {
        'parrot': '0 2px 4px rgba(33, 51, 67, 0.12), 0 0 1px rgba(33, 51, 67, 0.32)',
        'parrot-md': '0 5px 10px rgba(33, 51, 67, 0.12), 0 0 1px rgba(33, 51, 67, 0.32)',
        'parrot-lg': '0 10px 20px rgba(33, 51, 67, 0.12), 0 0 1px rgba(33, 51, 67, 0.32)',
      },
      borderRadius: {
        'parrot': '3px',
        'parrot-md': '5px',
        'parrot-lg': '8px',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
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
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 