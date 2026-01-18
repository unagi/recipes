import { describe, test, expect } from 'vitest';
import { assertUniqueRecipeIds, isValidRecipeId, RECIPE_ID_MAX_LENGTH } from './recipe-id';

describe('isValidRecipeId', () => {
	test('正常系: 英小文字・数字・ハイフンのみ', () => {
		expect(isValidRecipeId('borscht')).toBe(true);
		expect(isValidRecipeId('mapo-tofu-2')).toBe(true);
		expect(isValidRecipeId('ramen2024')).toBe(true);
	});

	test('異常系: 形式が不正', () => {
		expect(isValidRecipeId('Mapo-Tofu')).toBe(false);
		expect(isValidRecipeId('mapo_tofu')).toBe(false);
		expect(isValidRecipeId('')).toBe(false);
	});

	test('異常系: 上限を超える', () => {
		const longId = 'a'.repeat(RECIPE_ID_MAX_LENGTH + 1);
		expect(isValidRecipeId(longId)).toBe(false);
	});
});

describe('assertUniqueRecipeIds', () => {
	test('正常系: 重複なし', () => {
		expect(() => assertUniqueRecipeIds(['borscht', 'mapo-tofu'])).not.toThrow();
	});

	test('異常系: 重複あり', () => {
		expect(() => assertUniqueRecipeIds(['borscht', 'borscht'])).toThrow(
			/recipeIdが重複/
		);
	});
});
