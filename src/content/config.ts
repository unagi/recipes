import { defineCollection, z } from 'astro:content';

// ブログコレクション（既存）
const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

// レシピコレクション（新規）
const recipes = defineCollection({
	type: 'content',
	schema: (context) =>
		z
			.object({
			// 基本情報（必須）
			title: z.string(),
			description: z.string().default(''),

			// レシピタイプ（必須）
			recipeType: z.enum(['dish', 'ingredient', 'sauce', 'stock', 'condiment', 'preserve']),

			// 人数（dishの場合に使用）
			servings: z.number().positive().optional(),

			// できあがり量（dish以外の場合に使用）
			yield: z
				.object({
					amount: z.number().positive().optional(), // 単一値（正確な量）
					min: z.number().positive().optional(), // 最小値（レンジ表記）
					max: z.number().positive().optional(), // 最大値（レンジ表記）
					unit: z.string(), // 単位
				})
				.refine(
					(data) =>
						data.amount !== undefined || (data.min !== undefined && data.max !== undefined),
					{
						message: 'amount または (min と max) のいずれかが必須です',
					}
				)
				.optional(),

			// 調理時間
			cookTime: z.number().positive().optional(),
			prepTime: z.number().positive().optional(),

			// 材料（必須）
			ingredients: z.array(
				z.object({
					name: z.string(),
					amount: z.string(),
					group: z.string().optional(),
				})
			),

			// 手順（必須）
			steps: z.array(z.string()).min(1),

			// 調理器具・道具（経口摂取しないもの）
			equipment: z.array(z.string()).default([]),

			// カテゴリ・タグ
			category: z.enum(['japanese', 'western', 'chinese', 'ethnic', 'preserved-sauces']),
			tags: z.array(z.string()).default([]),

			// 難易度
			difficulty: z.enum(['easy', 'medium', 'hard']).optional(),

			// 公開日
			publishedDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			})
			.refine(
				(data) => {
					// dish の場合のみ servings が必須
					if (data.recipeType === 'dish') {
						return data.servings !== undefined;
					}
					// それ以外（ingredient, sauce, stock等）は任意
					return true;
				},
				{
					message: 'dish タイプの場合は servings（人数）が必須です',
				}
			),
});

export const collections = {
	blog,
	recipes,
};
