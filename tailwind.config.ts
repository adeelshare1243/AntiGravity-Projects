import type { Config } from "tailwindcss";
import tokens from "./design-tokens.json";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ...tokens.colors.brand,
          primary: '#FD521B',
          secondary: '#F88B35',
          light: '#FFF9F5',
          offWhite: '#F7F7F7',
        },
        darkScale: {
          900: '#000000',
          800: '#252F4A',
          700: '#4B5675',
        },
        dark: tokens.colors.dark,
        grey: tokens.colors.grey,
        surface: tokens.colors.surface,
        status: {
          ...tokens.colors.status,
          error: {
            DEFAULT: '#FF2A42',
            light: '#FF7C87',
          },
          success: {
            DEFAULT: '#17B21F',
            light: '#43DD4B',
          },
          warning: {
            DEFAULT: '#FFBB00',
            light: '#FFCF4A',
          },
        },
      },
      fontFamily: {
        sans: ['Google Sans', 'Google Sans Flex', 'Inter', 'sans-serif'],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        h1: ['48px', { lineHeight: '56px', fontWeight: '700', letterSpacing: '-1px' }],
        h2: ['40px', { lineHeight: '48px', fontWeight: '700', letterSpacing: '-0.5px' }],
        h3: ['32px', { lineHeight: '40px', fontWeight: '700' }],
        h4: ['24px', { lineHeight: '32px', fontWeight: '700' }],
        h5: ['20px', { lineHeight: '28px', fontWeight: '700' }],
        h6: ['18px', { lineHeight: '24px', fontWeight: '700' }],
        'body-xl': ['20px', { lineHeight: '28px' }],
        'body-lg': ['16px', { lineHeight: '24px' }],
        'body-md': ['14px', { lineHeight: '20px' }],
        'body-sm': ['12px', { lineHeight: '18px' }],
        'body-xs': ['10px', { lineHeight: '14px' }],
      },
      borderRadius: tokens.borderRadius,
      boxShadow: tokens.shadows,
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
