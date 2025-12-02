import { glob } from 'astro/loaders'
import { defineCollection, type ImageFunction, z } from 'astro:content'

const articles = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: 'src/content/articles',
	}),
	schema: ({ image }: { image: ImageFunction }) =>
		z.object({
			title: z.string(),
			published: z.date(),
			description: z.string().optional(),
			updated: z.date().optional(),
			category: z.string().optional(),
			tags: z.array(z.string()).optional(),
			image: image().optional(),
			draft: z.boolean().optional(),

			prevTitle: z.string().default(''),
			prevSlug: z.string().default(''),
			nextTitle: z.string().default(''),
			nextSlug: z.string().default(''),
		}),
})

const specs = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: 'src/content/specs',
	}),
})

export const collections = { articles, specs }
