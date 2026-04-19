// @ts-check
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: 'https://namthanhcar.com',
	integrations: [react()],
	image: { service: { entrypoint: "astro/assets/services/sharp" } },

	i18n: {
		defaultLocale: "vi",
		locales: ["vi", "en"],
		routing: {
			prefixDefaultLocale: false,
		},
	},

	vite: {
		plugins: [tailwindcss()],
	},
});
