/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        geo: {
          magenta: '#FF00A8',
          cyan: '#00E5FF',
          yellow: '#FFF000',
          purple: '#7B2CFF',
          lime: '#39FF14',
        },
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        retro: ['Georgia', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        bevel: 'inset 2px 2px 0 #fff, inset -3px -3px 0 #54209f, 4px 5px 0 #25113e',
      },
    },
  },
  plugins: [],
};
