import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef9ff",
          100: "#d9f2ff",
          200: "#b8e8ff",
          300: "#85d9ff",
          400: "#4fc3f7",
          500: "#29b6f6",
          600: "#039be5",
          700: "#0288d1",
          800: "#0277bd",
          900: "#01579b",
        },
        brand: {
          blue: "#4fc3f7",
          black: "#1a1a1a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
