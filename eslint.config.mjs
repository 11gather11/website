import eslint from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import astroParser from 'astro-eslint-parser'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
	{
		ignores: ['dist', 'node_modules', '.github', 'types.generated.d.ts', '.astro'],
	},

	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},

	eslint.configs.recommended,
	tseslint.configs.recommended,

	{
		plugins: {
			'jsx-a11y': jsxA11y,
		},
	},

	eslintPluginAstro.configs.recommended,
	eslintPluginAstro.configs['jsx-a11y-recommended'],

	{
		files: ['**/*.astro'],
		languageOptions: {
			parser: astroParser,
			parserOptions: {
				parser: tsParser,
				extraFileExtensions: ['.astro'],
			},
		},
		plugins: {
			'better-tailwindcss': eslintPluginBetterTailwindcss,
		},
		rules: {
			// enable all recommended rules to report a warning
			...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
			// enable all recommended rules to report an error
			...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,

			'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', { printWidth: 120, indent: 'tab' }],
			'better-tailwindcss/no-unregistered-classes': [
				'error',
				{ detectComponentClasses: true, ignore: ['banner-inner'] },
			],
		},
		settings: {
			'better-tailwindcss': {
				entryPoint: './src/styles/globals.css',
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
])
