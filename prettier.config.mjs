/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
export default {
	useTabs: true,
	semi: false,
	singleQuote: true,
	trailingComma: 'es5',
	printWidth: 120,

	plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
	tailwindStylesheet: './src/styles/globals.css',
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
}
