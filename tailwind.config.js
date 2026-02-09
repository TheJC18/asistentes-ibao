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
      colors: {
        // Colores Semánticos que cambian automáticamente con el tema
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
        },
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
        },
        card: 'var(--color-card)',
        overlay: 'var(--color-overlay)',
        border: {
          DEFAULT: 'var(--color-border)',
          hover: 'var(--color-border-hover)',
        },
        divider: 'var(--color-divider)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          disabled: 'var(--color-text-disabled)',
          'on-primary': 'var(--color-text-on-primary)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          light: 'var(--color-error-light)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          light: 'var(--color-info-light)',
        },
      },
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
