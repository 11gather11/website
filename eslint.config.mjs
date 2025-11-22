import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import eslintPluginAstro from 'eslint-plugin-astro'

export default defineConfig([
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...tseslint.configs.recommended,
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		extends: ['js/recommended'],
		languageOptions: { globals: globals.browser },
	},
	{
		ignores: ['dist', 'node_modules', '.github', 'types.generated.d.ts', '.astro'],
	},
])
