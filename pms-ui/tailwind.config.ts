import {heroui} from '@heroui/theme';
import type { Config } from "tailwindcss";




export default {
    darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
        

  ],
  theme: {
  	extend: {
  		colors: {
  			primary: '#00d154',
  			secondary: '#388e3c',
  			
  		},
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        slideDown: 'slideDown 0.2s ease-out',
      }
  	}
  },
  plugins: [heroui()],
} satisfies Config;
