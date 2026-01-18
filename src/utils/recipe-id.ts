export const RECIPE_ID_MAX_LENGTH = 40;
export const RECIPE_ID_PATTERN = /^[a-z0-9-]+$/;

export const isValidRecipeId = (value: string): boolean => {
	if (!value) {
		return false;
	}
	if (value.length > RECIPE_ID_MAX_LENGTH) {
		return false;
	}
	return RECIPE_ID_PATTERN.test(value);
};

export const assertUniqueRecipeIds = (ids: string[]): void => {
	const seen = new Set<string>();
	const duplicates = new Set<string>();

	for (const id of ids) {
		if (seen.has(id)) {
			duplicates.add(id);
		} else {
			seen.add(id);
		}
	}

	if (duplicates.size > 0) {
		throw new Error(`recipeIdが重複しています: ${[...duplicates].join(', ')}`);
	}
};
