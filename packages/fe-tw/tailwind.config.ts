import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "../../node_modules/daisyui/dist/**/*.js",
    "../../node_modules/react-daisyui/dist/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#8839E1", // button color
          "secondary": "#E5E7EB",
          "accent": "#F8F4FE", // header and slice color
          "accent-dark": "#D1D5DB",
          "neutral": "#F3F4F6",
          "base-100": "#FFFFFF",
          "info": "#F3F4F6",
          "success": "#86EFAC",
          "warning": "#FDE047",
          "error": "#FCA5A5",
          "base-content": "#000000",
        },
      },
    ],
  },
};

export default config;
