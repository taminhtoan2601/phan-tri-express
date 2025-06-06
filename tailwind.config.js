// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        // Ưu tiên Inter, sau đó Noto, cuối cùng mới Geist/system
        sans: [
          'var(--font-inter)',
          'var(--font-noto)',
          'var(--font-geist, ui-sans-serif)',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
};
