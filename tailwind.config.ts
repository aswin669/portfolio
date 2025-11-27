import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: { 
          500: "#6d28d9",
          600: "#5b21b6",
          700: "#4c1d95",
        },
        darkbg: "#0f1724",
        accent: {
          purple: "#a855f7",
          blue: "#3b82f6",
          pink: "#ec4899",
          cyan: "#06b6d4",
        },
        dark: {
          900: "#0a0f1d",
          800: "#0f1629",
          700: "#1a1f35",
          600: "#1e293b",
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-premium': 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
      },
      boxShadow: {
        "soft-lg": "0 20px 40px rgba(2,6,23,0.75)",
        "glow-sm": "0 0 15px rgba(139, 92, 246, 0.3)",
        "glow-md": "0 0 25px rgba(139, 92, 246, 0.4)",
        "glow-lg": "0 0 35px rgba(139, 92, 246, 0.5)",
        "neon": "0 0 5px theme('colors.purple.400'), 0 0 20px theme('colors.purple.700')",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)' },
          'to': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.8), 0 0 30px rgba(139, 92, 246, 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
