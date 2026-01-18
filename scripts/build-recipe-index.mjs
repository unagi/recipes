import fs from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const recipesDir = path.resolve('src/content/recipes');
const outputDir = path.resolve('src/data');
const outputFile = path.join(outputDir, 'recipe-index.json');

const frontmatterPattern = /^---\s*\n([\s\S]*?)\n---\s*\n/;

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const toStringOrNull = (value) => (value ? String(value) : null);

const buildIndex = async () => {
  const files = (await fs.readdir(recipesDir)).filter((file) => file.endsWith('.md'));
  const recipes = [];

  for (const file of files) {
    const filePath = path.join(recipesDir, file);
    const content = await fs.readFile(filePath, 'utf8');
    const match = content.match(frontmatterPattern);

    if (!match) {
      throw new Error(`Frontmatter not found: ${file}`);
    }

    const data = parseYaml(match[1]) ?? {};
    const recipeId = data.recipeId ?? path.basename(file, '.md');
    const tags = normalizeArray(data.tags);

    const record = {
      id: String(recipeId),
      title: data.title ?? '',
      description: data.description ?? '',
      category: data.category ?? null,
      recipeType: data.recipeType ?? null,
      tags,
      publishedDate: toStringOrNull(data.publishedDate),
      updatedDate: toStringOrNull(data.updatedDate),
    };

    record.searchText = [
      record.title,
      record.description,
      record.category ?? '',
      record.recipeType ?? '',
      ...record.tags,
    ]
      .filter(Boolean)
      .join(' ');

    recipes.push(record);
  }

  recipes.sort((a, b) => a.id.localeCompare(b.id, 'ja'));

  const tagIndex = {};
  const categoryIndex = {};
  const recipeTypeIndex = {};

  for (const recipe of recipes) {
    for (const tag of recipe.tags) {
      if (!tagIndex[tag]) tagIndex[tag] = [];
      tagIndex[tag].push(recipe.id);
    }

    if (recipe.category) {
      if (!categoryIndex[recipe.category]) categoryIndex[recipe.category] = [];
      categoryIndex[recipe.category].push(recipe.id);
    }

    if (recipe.recipeType) {
      if (!recipeTypeIndex[recipe.recipeType]) recipeTypeIndex[recipe.recipeType] = [];
      recipeTypeIndex[recipe.recipeType].push(recipe.id);
    }
  }

  const toSortedIndex = (index) =>
    Object.fromEntries(
      Object.entries(index)
        .sort(([a], [b]) => a.localeCompare(b, 'ja'))
        .map(([key, ids]) => [key, { count: ids.length, recipes: ids.sort() }])
    );

  const payload = {
    generatedAt: new Date().toISOString(),
    totals: {
      recipes: recipes.length,
      tags: Object.keys(tagIndex).length,
      categories: Object.keys(categoryIndex).length,
      recipeTypes: Object.keys(recipeTypeIndex).length,
    },
    recipes,
    tags: toSortedIndex(tagIndex),
    categories: toSortedIndex(categoryIndex),
    recipeTypes: toSortedIndex(recipeTypeIndex),
  };

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${outputFile}`);
};

buildIndex().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
