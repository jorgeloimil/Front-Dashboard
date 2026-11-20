// Misma paleta que Fitcina, estilo "Mercado" (neo-brutalista) sobrio: tinta, crema y un
// único acento, el tomate. Los dos modos (claro y oscuro) salen de aquí.
const tinta = '#161112';

const tomate = {
  50: '#FFF1EC',
  100: '#FFE0D6',
  200: '#FFC2AF',
  300: '#FF9C80',
  400: '#FF7A57',
  500: '#FF5A36',
  600: '#E8401C',
  700: '#B92F12',
  800: '#8F2612',
  900: '#6E2113',
  950: '#3C0D05',
};

const crema = {
  50: '#FFF6E5',
  100: '#F8ECD5',
  200: '#EBDFC6',
  300: '#D6C9AE',
  400: '#A3957E',
  500: '#6E6253',
  600: '#51473C',
  700: '#3A322B',
  800: '#262020',
  900: tinta,
  950: '#0B0809',
};

export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: { tinta, crema, tomate },
      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Archivo Black"', '"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Sombras duras, sin desenfoque: el sello del estilo
        hard: `3px 3px 0 ${tinta}`,
        'hard-lg': `6px 6px 0 ${tinta}`,
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: { 'fade-in': 'fade-in 0.4s ease-out both' },
    },
  },
  plugins: [],
};
