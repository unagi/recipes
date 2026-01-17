import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

/**
 * HTMLから見出し（h1-h6）を抽出する
 * @param html HTMLテキスト
 * @returns 見出しレベルの配列（例: [1, 2, 3, 3, 4, 2]）
 */
function extractHeadingLevelsFromHTML(html: string): number[] {
	const headingRegex = /<h([1-6])[^>]*>/g;
	const levels: number[] = [];
	let match;

	while ((match = headingRegex.exec(html)) !== null) {
		const level = parseInt(match[1], 10);
		levels.push(level);
	}

	return levels;
}

/**
 * 見出し階層が正しいかチェックする
 * h2の次にh4が来るなど、レベルを飛ばす場合はエラー
 * @param levels 見出しレベルの配列
 * @returns エラーメッセージ配列（エラーがなければ空配列）
 */
function validateHeadingHierarchy(levels: number[]): string[] {
	const errors: string[] = [];

	for (let i = 1; i < levels.length; i++) {
		const prev = levels[i - 1];
		const curr = levels[i];

		// 前の見出しより2レベル以上深くなっている場合はエラー
		if (curr - prev > 1) {
			errors.push(
				`見出しレベルが飛んでいます: h${prev}の後にh${curr}が来ています（位置: ${i + 1}番目の見出し）`
			);
		}
	}

	return errors;
}

/**
 * 指定されたディレクトリ内の全HTMLファイルを再帰的に取得
 */
function getAllHTMLFiles(dir: string): string[] {
	if (!existsSync(dir)) {
		return [];
	}

	const files: string[] = [];
	const entries = readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...getAllHTMLFiles(fullPath));
		} else if (entry.name.endsWith('.html')) {
			files.push(fullPath);
		}
	}

	return files;
}

describe('レシピHTML見出し階層検証', () => {
	beforeAll(() => {
		// distディレクトリが存在しない場合はビルドを実行
		const distDir = join(process.cwd(), 'dist');
		if (!existsSync(distDir)) {
			console.log('distディレクトリが存在しないため、ビルドを実行します...');
			execSync('npm run build', { stdio: 'inherit' });
		}
	}, 120000); // タイムアウト: 2分

	test('全レシピHTMLの見出し階層が正しいこと', () => {
		const distDir = join(process.cwd(), 'dist');
		const htmlFiles = getAllHTMLFiles(distDir);

		// レシピページのみをフィルタ（カテゴリ配下のページ）
		const recipePages = htmlFiles.filter((file) => {
			const relativePath = file.replace(distDir + '/', '');
			// カテゴリ/slug形式のパスのみ（blog, aboutなどを除外）
			return (
				relativePath.match(/^(japanese|western|chinese|ethnic|preserved-sauces)\/[^/]+\//) !==
				null
			);
		});

		const errors: Array<{ file: string; errors: string[] }> = [];

		for (const filePath of recipePages) {
			// ファイル内容を読み込む
			const html = readFileSync(filePath, 'utf-8');

			// 見出しレベルを抽出
			const levels = extractHeadingLevelsFromHTML(html);

			// 見出しがない場合はスキップ
			if (levels.length === 0) {
				continue;
			}

			// 階層をバリデーション
			const fileErrors = validateHeadingHierarchy(levels);

			if (fileErrors.length > 0) {
				// 相対パスに変換して表示
				const relativePath = filePath.replace(distDir + '/', '');
				errors.push({
					file: relativePath,
					errors: fileErrors,
				});
			}
		}

		// エラーがあれば詳細を表示して失敗
		if (errors.length > 0) {
			const errorMessage = errors
				.map(({ file, errors }) => {
					return `\n【${file}】\n${errors.map((e) => `  - ${e}`).join('\n')}`;
				})
				.join('\n');

			expect.fail(`見出し階層に問題があるレシピが見つかりました:${errorMessage}`);
		}
	});

	describe('extractHeadingLevelsFromHTML', () => {
		test('HTMLから見出しレベルを正しく抽出できる', () => {
			const html = `
<h1>タイトル</h1>
<h2>見出し2</h2>
<p>本文</p>
<h3>見出し3</h3>
<h4>見出し4</h4>
<h2>見出し2-2</h2>
<h3>見出し3-2</h3>
`;
			const levels = extractHeadingLevelsFromHTML(html);
			expect(levels).toEqual([1, 2, 3, 4, 2, 3]);
		});

		test('属性付き見出しタグも正しく抽出できる', () => {
			const html = `
<h2 class="title" id="heading">見出し2</h2>
<h3 data-testid="test">見出し3</h3>
`;
			const levels = extractHeadingLevelsFromHTML(html);
			expect(levels).toEqual([2, 3]);
		});
	});

	describe('validateHeadingHierarchy', () => {
		test('正しい見出し階層ではエラーが出ない', () => {
			const levels = [1, 2, 3, 4, 3, 2, 3];
			const errors = validateHeadingHierarchy(levels);
			expect(errors).toEqual([]);
		});

		test('h2の次にh4が来る場合はエラー', () => {
			const levels = [1, 2, 4];
			const errors = validateHeadingHierarchy(levels);
			expect(errors.length).toBeGreaterThan(0);
			expect(errors[0]).toContain('h2の後にh4');
		});

		test('h3の次にh5が来る場合はエラー', () => {
			const levels = [1, 2, 3, 5];
			const errors = validateHeadingHierarchy(levels);
			expect(errors.length).toBeGreaterThan(0);
			expect(errors[0]).toContain('h3の後にh5');
		});

		test('h4からh2に戻るのはOK', () => {
			const levels = [1, 2, 3, 4, 2];
			const errors = validateHeadingHierarchy(levels);
			expect(errors).toEqual([]);
		});
	});
});
