/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teyvat: {
          dark: '#120F1D',
          night: '#1D1A2A',
          parchment: '#E9E5DC',
          cream: '#F5F2EB',
          indigo: '#5D5187',
          gold: '#FFE7A5',
          goldDark: '#D3BC8E',
          goldLight: '#ECE5D8',
          textMuted: '#4A5366',
          textDark: '#1D1A2A',
        },
        rarity: {
          1: '#818486',
          2: '#5A977A',
          3: '#5987AD',
          4: '#9470BB',
          5: '#C87C24',
        },
      },
    },
  },
  plugins: [],
};
