import sitemap from '@astrojs/sitemap'
import compress from '@playform/compress'
import swup from '@swup/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import pagefind from 'astro-pagefind'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import remarkBreaks from 'remark-breaks'
import remarkEmoji from 'remark-emoji'
import remarkLinkCard from 'remark-link-card-plus'
import remarkMath from 'remark-math'
import sonda from 'sonda/astro'

import { SITE } from './src/config'
import remarkExcerpt from './src/plugins/remark-excerpt'
import remarkReadingTime from './src/plugins/remark-reading-time'

export default defineConfig({
	output: 'static',

	site: SITE.site,
	base: SITE.base,
	trailingSlash: SITE.trailingSlash ? 'always' : 'never',

	vite: {
		plugins: [tailwindcss()],
		build: {
			sourcemap: true,
		},
	},

	integrations: [
		swup({
			theme: false,
			containers: ['main', 'footer', '.banner-inner'],
			smoothScrolling: true,
			progress: true,
			cache: true,
			preload: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
		}),
		icon(),
		sitemap(),
		pagefind(),
		compress(),
		sonda(),
	],

	markdown: {
		shikiConfig: {
			theme: 'github-dark',
		},
		remarkPlugins: [
			remarkBreaks,
			[
				remarkLinkCard,
				{
					cache: false,
					shortenUrl: true,
					thumbnailPosition: 'right',
				},
			],
			remarkMath,
			remarkReadingTime,
			remarkExcerpt,
			remarkEmoji,
		],
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					target: '_blank',
					rel: ['nofollow', 'noreferrer', 'noopener'],
				},
			],
			rehypeKatex,
		],
	},
})
