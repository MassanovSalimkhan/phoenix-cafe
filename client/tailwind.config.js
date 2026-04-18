/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'phoenix-dark': '#1a1a1a',   // тёмный фон (почти чёрный)
        'phoenix-card': '#262626',    // фон карточек, чуть светлее
        'phoenix-gold': '#fbbf24',    // золотой основной
        'phoenix-gold-light': '#fcd34d', // светлое золото
        'phoenix-gold-dark': '#b45309', // тёмное золото для теней
        'phoenix-text': '#f5f5f5',    // светлый текст
        'phoenix-text-muted': '#a3a3a3', // приглушённый текст
      },
    },
  },
  plugins: [],
}