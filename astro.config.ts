import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

import config from './src/config'

export default defineConfig({
	output: 'static',

	site: config.site.site,

	integrations: [sitemap()],

	vite: {
		plugins: [tailwindcss()],
	},
})
