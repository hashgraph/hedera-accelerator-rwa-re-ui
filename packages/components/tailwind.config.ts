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
				background: "var(--background)",
				foreground: "var(--foreground)",
				lightBlue: {
					100: "rgba(224,242,254,var(--tw-bg-opacity))",
					200: "rgba(186,230,253,var(--tw-bg-opacity))",
					300: "rgba(125,211,252,var(--tw-bg-opacity))",
					400: "rgba(56,189,248,var(--tw-bg-opacity))",
					500: "rgba(14,165,233,var(--tw-bg-opacity))",
					600: "rgba(2,132,199,var(--tw-bg-opacity))",
					700: "rgba(3,105,161,var(--tw-bg-opacity))",
					800: "rgba(7,89,133,var(--tw-bg-opacity))",
					900: "rgba(12,74,110,var(--tw-bg-opacity))",
				},
				teal: {
					200: "rgba(153, 246, 228,var(--tw-bg-opacity))",
					500: "rgba(20, 184, 166,var(--tw-bg-opacity))",
				},
			},
		},
	},
	plugins: [
		require('daisyui'),
	]
};

export default config;
