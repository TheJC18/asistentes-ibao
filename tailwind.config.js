/**
 * tailwind.config.js clonado de Asistentes
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
  screens: {
    '2xs': '320px',
    'xs': '375px',
    'ss': '480px',
      ...require('tailwindcss/defaultTheme').screens,
    },
    extend: {
      keyframes: {
        'fadein': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'fadeout': {
          'from': { opacity: '1' },
          'to': { opacity: '0' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        'fadein': 'fadein 0.5s ease-in',
        'fadeout': 'fadeout 0.5s ease-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
