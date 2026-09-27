import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          background: "#F4F2EF",
          primary: "#990808",
          accent: "#F44027",
          secondary: "#EDC537",
        },
        aml: {
          blue: "#1C4BBC",
          green: "#82BE3B",
          powder: "#CAD3E6",
          dark: "#0F2B75",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        times: ["var(--font-times)", '"Times New Roman"', "Times", "serif"],
        akzidenz: ["var(--font-akzidenz)", '"Akzidenz-Grotesk"', '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      animation: {
        "scan-line": "scanLine 2s ease-in-out infinite",
      },
      keyframes: {
        scanLine: {
          "0%, 100%": { top: "8px", opacity: "0.6" },
          "50%": { top: "calc(100% - 8px)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
