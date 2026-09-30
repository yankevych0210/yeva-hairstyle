/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    screens: { xs: '400px', sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        sand: token('sand'),
        line: token('line'),
        ink: token('ink'),
        'ink-soft': token('ink-soft'),
        accent: token('accent'),
        'accent-ink': token('accent-ink'),
        dark: token('dark'),
        'on-dark': token('on-dark'),
        'on-dark-soft': token('on-dark-soft'),
      },
      fontFamily: {
        // Мають збігатися з font-family у @fontsource-файлах, імпортованих у main.css
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Manrope Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        soft: 'var(--ease-soft)',
      },
      maxWidth: { page: '1200px' },
    },
  },
  plugins: [],
}
