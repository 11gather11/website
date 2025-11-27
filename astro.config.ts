import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

import { SITE } from './src/config'

export default defineConfig({
	output: 'static',

	site: SITE.site,

	integrations: [sitemap()],

	vite: {
		plugins: [tailwindcss()],
	},
})
