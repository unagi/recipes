// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'うなぎまるキッチン';
export const SITE_DESCRIPTION = '家庭で作れる美味しいレシピを公開しています';

// レシピカテゴリ定義
export const CATEGORIES = {
	japanese: { label: '和食', slug: 'japanese' },
	western: { label: '洋食', slug: 'western' },
	chinese: { label: '中華', slug: 'chinese' },
	ethnic: { label: 'エスニック', slug: 'ethnic' },
	'preserved-sauces': { label: '保存食・タレ', slug: 'preserved-sauces' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
