import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "../../node_modules/daisyui/dist/**/*.js",
    "../../node_modules/react-daisyui/dist/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#EADFEA", // lilac-dark
          "secondary": "#E5E7EB", // light gray
          "accent": "#F8F4FE", // lilac
          "neutral": "#F3F4F6",
          "base-100": "#FFFFFF",
          "info": "#F3F4F6", // soft gray for panels
          "success": "#86EFAC",
          "warning": "#FDE047",
          "error": "#FCA5A5",
        },
      },
    ],
  },
};

export default config;
