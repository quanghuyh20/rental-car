import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.mdoc', base: './src/content/blog' }),
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		author: z.string().default('Nam Thanh Car'),
		cover: image().optional(),
		locale: z.enum(['vi', 'en']).default('vi'),
		draft: z.boolean().default(false),
		cta: z.object({
			discriminant: z.boolean(),
			value: z.object({
				text: z.string(),
				href: z.string(),
			}).optional(),
		}).optional(),
	}),
});

const cars = defineCollection({
	loader: glob({ pattern: '**/*.mdoc', base: './src/content/cars' }),
	schema: ({ image }) => z.object({
		name: z.string(),
		model: z.string(),
		seats: z.number().int().positive(),
		transmission: z.enum(['automatic', 'manual']),
		fuel: z.enum(['gasoline', 'diesel', 'electric']),
		pricePerDay: z.number().int().positive(),
		pricePerMonth: z.number().int().positive(),
		available: z.boolean().default(true),
		images: z.array(image()).default([]),
		gallery: z.array(image()).default([]),
	}),
});

const services = defineCollection({
	loader: glob({ pattern: '**/*.mdoc', base: './src/content/services' }),
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		cover: image().optional(),
	}),
});

const siteConfig = defineCollection({
	loader: glob({ pattern: 'site-config.yaml', base: './src/content' }),
	schema: z.object({
		phone: z.string(),
		phoneDisplay: z.string(),
		email: z.string(),
		address: z.string(),
		zaloUrl: z.string(),
		facebookUrl: z.string(),
		mapsUrl: z.string(),
	}),
});

const aboutPage = defineCollection({
	loader: glob({ pattern: 'about-page.mdoc', base: './src/content' }),
	schema: z.object({
		headline: z.string(),
		description: z.string(),
		foundedYear: z.number().int(),
	}),
});

export const collections = { cars, blog, services, siteConfig, aboutPage };
