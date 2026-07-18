module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./js/**/*.js",
    "./cv/index.html",
    "./cv/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        accent: {
          cyan: '#06b6d4',
          sky: '#38bdf8',
          emerald: '#10b981',
          purple: '#8b5cf6',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
