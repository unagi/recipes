// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// 静的サイト生成モード（Github Pages用）
	output: 'static',

	// カスタムドメイン
	site: 'https://recipes.ymgch.org',

	// カスタムドメインのルートで公開するため base は不要
	// サブディレクトリで公開する場合のみ base を設定

	integrations: [mdx(), sitemap()],
});
