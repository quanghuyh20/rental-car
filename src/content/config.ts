import { defineCollection, z } from 'astro:content';

const cars = defineCollection({
	type: 'content',
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
	}),
});

export const collections = { cars };
