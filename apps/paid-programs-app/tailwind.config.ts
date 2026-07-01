import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17211B",
        canvas: "#F4F3EE",
        acid: "#D7FF52",
        moss: "#496B52",
      },
      boxShadow: {
        card: "0 12px 40px rgba(23, 33, 27, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
