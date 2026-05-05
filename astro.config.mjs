import { readdirSync } from "node:fs";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import keystatic from "@keystatic/astro";
import cloudflare from "@astrojs/cloudflare";
import node from "@astrojs/node";

const isProd = process.env.NODE_ENV === "production";
const site = "https://namthanhcar.net";

const slugs = (dir) =>
	readdirSync(dir)
		.filter((f) => f.endsWith(".mdoc"))
		.map((f) => f.replace(".mdoc", ""));

const carSlugs = slugs("src/content/cars");
const blogSlugs = slugs("src/content/blog");
const serviceSlugs = slugs("src/content/services");

const customPages = [
	...serviceSlugs.map((s) => `${site}/dich-vu/${s}/`),
	...blogSlugs.map((s) => `${site}/blog/${s}/`),
	...carSlugs.map((s) => `${site}/xe/${s}/`),
	...carSlugs.map((s) => `${site}/en/car-rental/${s}/`),
];

export default defineConfig({
	site,
	integrations: [
		react(),
		markdoc(),
		keystatic(),
		sitemap({
			i18n: {
				defaultLocale: "vi",
				locales: {
					vi: "vi-VN",
					en: "en-US",
				},
			},
			filter: (page) => !page.includes("/keystatic"),
			customPages,
		}),
	],
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

	adapter: isProd ? cloudflare() : node({ mode: "standalone" }),
	output: "server",
});
