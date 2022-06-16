module.exports = {
  content: ['./public/index.html', './src/**/*.svelte'],
  theme: {
    extend: {
      colors: {
        'oh-black': '#282a36',
        'oh-blackout': '#12141E',
        'oh-white': '#F8F8F2',
        'oh-whiteout': '#FFFFFF',
        'oh-red': '#FF5555',
        'oh-orange': '#FFB86C',
        'oh-yellow': '#F1FA8C',
        'oh-green': '#50FA7B',
        'oh-blue': '#8BE9FD',
        'oh-indigo': '#2A0D5D',
        'oh-purple': '#BD93F9',
        'oh-pink': '#FF79C6',
        'oh-gray-100': '#F8F8F2',
        'oh-gray-200': '#e2e8f0',
        'oh-gray-300': '#cbd5e1',
        'oh-gray-400': '#94a3b8',
        'oh-gray-500': '#64748b',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ],
}
