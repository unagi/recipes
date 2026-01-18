import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { RECIPE_ID_MAX_LENGTH, RECIPE_ID_PATTERN } from './utils/recipe-id';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

const recipes = defineCollection({
	// Load Markdown and MDX files in the `src/content/recipes/` directory.
	loader: glob({ base: './src/content/recipes', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		recipeId: z
			.string()
			.min(1)
			.max(RECIPE_ID_MAX_LENGTH)
			.regex(RECIPE_ID_PATTERN, 'recipeIdは英小文字・数字・ハイフンのみ使用できます'),
		description: z.string(),
		recipeType: z.string(),
		publishedDate: z.coerce.date(),
		ingredients: z.array(
			z.object({
				name: z.string(),
				amount: z.string(),
				group: z.string().optional(),
			})
		),
		steps: z.array(z.string()),
		servings: z.number().optional(),
		yield: z
			.object({
				min: z.number().optional(),
				max: z.number().optional(),
				amount: z.number().optional(),
				unit: z.string(),
			})
			.optional(),
		prepTime: z.number().optional(),
		cookTime: z.number().optional(),
		equipment: z.array(z.string()).default([]),
		category: z.string().optional(),
		tags: z.array(z.string()).default([]),
		difficulty: z.string().optional(),
	}),
});

export const collections = { blog, recipes };
