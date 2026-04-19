import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import astro from "eslint-plugin-astro";
import react from "eslint-plugin-react";
import globals from "globals";

export default [
	eslint.configs.recommended,
	...astro.configs.recommended,
	{
		files: ["**/*.{ts,tsx}"],
		plugins: { "@typescript-eslint": tseslint, react },
		languageOptions: {
			parser: tsParser,
			globals: { ...globals.browser },
		},
		settings: { react: { version: "detect" } },
		rules: {
			...tseslint.configs.recommended.rules,
			"react/react-in-jsx-scope": "off",
		},
	},
	{
		files: ["scripts/**/*.ts"],
		languageOptions: { globals: { ...globals.node } },
	},
	{
		ignores: ["dist/", ".astro/", ".wrangler/"],
	},
];
