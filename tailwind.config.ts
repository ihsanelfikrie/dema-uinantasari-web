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
    },
  },
  plugins: [],
};

export default config;
