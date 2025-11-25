import pluginJs from '@eslint/js'
import typescriptEslintParser from '@typescript-eslint/parser'
import astroParser from 'astro-eslint-parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginAstro from 'eslint-plugin-astro'
import tailwindcss from 'eslint-plugin-better-tailwindcss'
import importPlugin from 'eslint-plugin-import'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import("eslint").Linter.Config[]} */
export default [
	pluginJs.configs.recommended,

	importPlugin.flatConfigs.recommended,

	...tseslint.configs.recommended,

	{
		plugins: {
			'jsx-a11y': jsxA11yPlugin,
		},
	},

	...eslintPluginAstro.configs['jsx-a11y-recommended'],

	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},

	{
		settings: {
			'import/resolver': {
				typescript: {},
			},
		},
		rules: {
			'import/no-unresolved': [
				'error',
				{
					ignore: ['^astro:'],
				},
			],
		},
	},

	{
		files: ['**/*.astro'],
		languageOptions: {
			parser: astroParser,
			parserOptions: {
				parser: typescriptEslintParser,
				extraFileExtensions: ['.astro'],
			},
		},
	},

	{
		plugins: {
			'better-tailwindcss': tailwindcss,
		},
		rules: {
			...tailwindcss.configs['recommended-warn'].rules,

			...tailwindcss.configs['recommended-error'].rules,
		},
		settings: {
			'better-tailwindcss': {
				entryPoint: 'src/styles/global.css',
			},
		},
	},

	{
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
	},

	eslintConfigPrettier,

	{
		ignores: ['dist', 'node_modules', '.github', 'types.generated.d.ts', '.astro'],
	},
]
