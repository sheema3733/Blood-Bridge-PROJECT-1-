/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#C5162D', // Primary Medical Crimson
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        charcoal: {
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        warm: {
          50: '#FCFCFD',
          100: '#F8FAFC',
          200: '#F1F5F9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'modal': '0 20px 40px -10px rgba(15, 23, 42, 0.2), 0 8px 16px -4px rgba(15, 23, 42, 0.1)',
      }
    },
  },
  plugins: [],
}
